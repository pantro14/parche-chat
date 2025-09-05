import { assertAreUsers, assertIsChat } from '@/helpers/type-guards';
import { UserType } from '@/interfaces';
import { ChatState, SetChats } from '@/redux/chatSlice';
import { RootState } from '@/redux/store';
import { UserState } from '@/redux/userSlice';
import { createNewChat } from '@/server-actions/chats';
import { getAllUsers } from '@/server-actions/users';
import { Avatar, Button, Divider, message, Modal } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatCardSkeleton from './chat-card-skeleton';

interface NewChatModalProps {
  showNewChatModal: boolean;
  setShowNewChatModal: Dispatch<SetStateAction<boolean>>;
}

function NewChatModal({
  showNewChatModal,
  setShowNewChatModal,
}: NewChatModalProps) {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const dispatch = useDispatch();

  const { currentUserData }: UserState = useSelector(
    (state: RootState) => state.user
  );
  const { chats }: ChatState = useSelector((state: RootState) => state.chats);

  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      assertAreUsers(response);
      setUsers(response);
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const onAddToChat = async (userId: string) => {
    try {
      setSelectedUserId(userId);
      setLoading(true);
      const response = await createNewChat({
        users: [userId, currentUserData!._id],
        createdBy: currentUserData!._id,
        isGroupChat: false,
      });
      assertIsChat(response);
      dispatch(SetChats(response));
      message.success('Chat created successfully');
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    } finally {
      setShowNewChatModal(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showNewChatModal) {
      getUsers();
    }
  }, [showNewChatModal]);

  return (
    <Modal
      open={showNewChatModal}
      onCancel={() => setShowNewChatModal(false)}
      footer={null}
      centered
    >
      <div className='flex flex-col gap-5'>
        <h1 className='text-primary text-center text-xl font-bold'>
          Create New Chat
        </h1>
        {loading && !selectedUserId ? (
          <div className='flex py-2 flex-col'>
            {Array.from(Array(4).keys()).map((key) => (
              <ChatCardSkeleton key={key} />
            ))}
          </div>
        ) : users.length > 0 ? (
          <div className='flex flex-col'>
            {users
              .filter((user) => user._id !== currentUserData?._id)
              .filter((user) =>
                chats.every(
                  (chat) =>
                    chat.isGroupChat ||
                    (chat.users as UserType[]).every((u) => u._id !== user._id)
                )
              )
              .map((user) => (
                <div key={user._id}>
                  <div
                    className='flex justify-between items-center'
                    // onClick={() => initiateChatWithUser(user)} // Implement this function to handle chat initiation
                  >
                    <div className='flex gap-3 items-center'>
                      <Avatar alt={user.name} src={user?.profilePicture} />
                      <div className='flex gap-5 items-center'></div>
                      <span className='text-gray-500'>{user.name}</span>
                    </div>
                    <Button
                      loading={selectedUserId === user._id && loading}
                      size='small'
                      type='primary'
                      onClick={() => onAddToChat(user._id)}
                    >
                      Add to chat
                    </Button>
                  </div>
                  <Divider style={{ margin: '15px' }} />
                </div>
              ))}
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

export default NewChatModal;
