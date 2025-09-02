import { assertUsersAreGotten } from '@/helpers/type-guards';
import { UserType } from '@/interfaces';
import { RootState } from '@/redux/store';
import { UserState } from '@/redux/user/userSlice';
import { getAllUsers } from '@/server-actions/users';
import { Avatar, Button, Divider, message, Modal, Spin } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface NewChatModalProps {
  showNewChatModal: boolean;
  setShowNewChatModal: Dispatch<SetStateAction<boolean>>;
}

function NewChatModal({
  showNewChatModal,
  setShowNewChatModal,
}: NewChatModalProps) {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, isLoading] = useState<boolean>(false);

  const { currentUserData }: UserState = useSelector(
    (state: RootState) => state.user
  );

  const getUsers = async () => {
    isLoading(true);
    try {
      const response = await getAllUsers();
      assertUsersAreGotten(response);
      setUsers(response);
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    } finally {
      isLoading(false);
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
        {loading ? (
          <div className='flex justify-center my-20'>
            <Spin size='large' />
          </div>
        ) : users.length > 0 ? (
          <div className='flex flex-col'>
            {users
              .filter((user) => user._id !== currentUserData?._id)
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
                    <Button size='small'>Add to chat</Button>
                  </div>
                  <Divider style={{ margin: '15px' }} />
                </div>
              ))}
          </div>
        ) : (
          <span>bla</span>
        )}
      </div>
    </Modal>
  );
}

export default NewChatModal;
