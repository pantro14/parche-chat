import { UserType } from '@/interfaces';
import { ChatType } from '@/interfaces/chat';
import { ChatState, SetSelectedChat } from '@/redux/chatSlice';
import { RootState } from '@/redux/store';
import { UserState } from '@/redux/userSlice';
import { Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

interface ChatCardProps {
  chat: ChatType;
}

function ChatCard({ chat }: ChatCardProps) {
  const { isGroupChat, users, groupName, groupProfilePicture } = chat;
  const { currentUserData }: UserState = useSelector(
    (state: RootState) => state.user
  );
  const { selectedChat }: ChatState = useSelector(
    (state: RootState) => state.chats
  );

  const dispatch = useDispatch();

  const recipient = !isGroupChat
    ? (users as UserType[]).find((user) => user._id !== currentUserData?._id)
    : null;

  const chatName = isGroupChat ? groupName : recipient?.name;
  const chatImage = isGroupChat
    ? groupProfilePicture
    : recipient?.profilePicture;

  return (
    <div
      className={`flex justify-between hover:bg-gray-100 py-3 px-2 rounded cursor-pointer ${
        selectedChat?._id === chat._id
          ? 'bg-gray-100 border border-gray-200 border-solid'
          : ''
      }`}
      onClick={() => dispatch(SetSelectedChat(chat))}
    >
      <div className='flex gap-5 items-center'>
        <Avatar src={chatImage} className='w-10 h-10 rounded-full'></Avatar>
        <span className='text-gray-700 text-sm'>{chatName}</span>
      </div>
      <div>
        <span>message time</span>
      </div>
    </div>
  );
}

export default ChatCard;
