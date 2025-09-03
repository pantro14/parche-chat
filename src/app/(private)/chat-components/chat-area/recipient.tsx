import { UserType } from '@/interfaces';
import { ChatState } from '@/redux/chatSlice';
import { RootState } from '@/redux/store';
import { UserState } from '@/redux/userSlice';
import { Avatar } from 'antd';
import { useSelector } from 'react-redux';

function Recipient() {
  const { selectedChat }: ChatState = useSelector(
    (state: RootState) => state.chats
  );
  const { currentUserData }: UserState = useSelector(
    (state: RootState) => state.user
  );

  const { isGroupChat, users, groupName, groupProfilePicture } = selectedChat!;

  const recipient = !isGroupChat
    ? (users as UserType[]).find((user) => user._id !== currentUserData!._id)
    : null;

  const chatName = isGroupChat ? groupName : recipient?.name;
  const chatImage = isGroupChat
    ? groupProfilePicture
    : recipient?.profilePicture;

  return (
    <div className='flex justify-between py-3 px-5 border-0 border-b border-gray-200 border-solid bg-gray-200'>
      <div className='flex gap-5 items-center'>
        <Avatar src={chatImage} className='w-10 h-10 rounded-full'></Avatar>
        <span className='text-gray-700 text-sm'>{chatName}</span>
      </div>
    </div>
  );
}

export default Recipient;
