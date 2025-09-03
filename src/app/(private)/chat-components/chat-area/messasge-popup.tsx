import { formatDateTime } from '@/helpers/date-format';
import { MessageType } from '@/interfaces/message';
import { ChatState } from '@/redux/chatSlice';
import { RootState } from '@/redux/store';
import { UserState } from '@/redux/userSlice';
import { Avatar } from 'antd';
import { useSelector } from 'react-redux';

interface MessagePopUpProps {
  message: MessageType;
}

function MessagePopup({ message }: MessagePopUpProps) {
  const { selectedChat }: ChatState = useSelector(
    (state: RootState) => state.chats
  );
  const { currentUserData }: UserState = useSelector(
    (state: RootState) => state.user
  );

  if (message.sender?._id === currentUserData?._id) {
    return (
      <div className='flex justify-end gap-2'>
        <div className='flex flex-col gap-2'>
          <p className='bg-primary text-white py-2 px-5 rounded-xl rounded-tl-none'>
            {message.text}
          </p>
          <span className='text-xs text-gray-500'>
            {formatDateTime(message.createdAt)}
          </span>
        </div>
        <Avatar
          src={message.sender.profilePicture}
          alt='avatar'
          className='w-6 h-6 rounded-full'
        />
      </div>
    );
  } else {
    return (
      <div className='flex gap-2'>
        <Avatar
          src={message.sender.profilePicture}
          alt='avatar'
          className='w-6 h-6 rounded-full'
        />

        <div className='flex flex-col gap-2'>
          <div className='bg-gray-200 py-2 px-7 rounded-xl rounded-tr-none'>
            <span className='text-blue-500 text-xs font-semibold'>
              {message.sender?.name}
            </span>
            <p className='text-black m-0 pt-1 text-sm'>{message.text}</p>
          </div>
          <span className='text-xs text-gray-500'>
            {formatDateTime(message.createdAt)}
          </span>
        </div>
      </div>
    );
  }
}

export default MessagePopup;
