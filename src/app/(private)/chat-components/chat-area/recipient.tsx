import { UserType } from '@/interfaces';
import { ChatState } from '@/redux/chatSlice';
import { RootState } from '@/redux/store';
import { UserState } from '@/redux/userSlice';
import { Avatar } from 'antd';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import RecipientInfo from './recipient-info';

function Recipient() {
  const [showRecipientInfo, setShowRecipientInfo] = useState<boolean>(false);

  const { selectedChat }: ChatState = useSelector(
    (state: RootState) => state.chats
  );
  const { currentUserData, onlineUsers }: UserState = useSelector(
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

  const onlineIndicator = () => {
    if (recipient && onlineUsers.includes(recipient._id)) {
      return <span className='text-green-500 italic text-xs'>Online</span>;
    }
    return null;
  };

  return (
    <div className='flex justify-between py-3 px-5 border-0 border-b border-gray-200 border-solid bg-gray-200'>
      <div className='flex gap-5 items-center'>
        <Avatar
          src={chatImage}
          className='w-10 h-10 rounded-full cursor-pointer'
          onClick={() => setShowRecipientInfo(true)}
        ></Avatar>
        <div className='flex flex-col'>
          <span className='text-gray-700 text-sm'>{chatName}</span>
          {onlineIndicator()}
        </div>
      </div>
      {showRecipientInfo && (
        <RecipientInfo {...{ showRecipientInfo, setShowRecipientInfo }} />
      )}
    </div>
  );
}

export default Recipient;
