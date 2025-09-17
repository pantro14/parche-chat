import { formatDateTime } from '@/helpers/date-format';
import { UserType } from '@/interfaces';
import { MessageType } from '@/interfaces/message';
import { ChatState } from '@/redux/chatSlice';
import { RootState } from '@/redux/store';
import { UserState } from '@/redux/userSlice';
import { Avatar } from 'antd';
import Image from 'next/image';
import { useSelector } from 'react-redux';

interface MessagePopUpProps {
  message: MessageType;
}

function MessagePopup({ message }: MessagePopUpProps) {
  const { currentUserData }: UserState = useSelector(
    (state: RootState) => state.user
  );
  const { selectedChat }: ChatState = useSelector(
    (state: RootState) => state.chats
  );

  let read = false;
  if (selectedChat!.users?.length - 1 === message.readBy.length) {
    read = true;
  }

  const sender = message.sender as UserType;

  const messageImages = () => {
    if (message.images && message.images.length > 0) {
      return (
        <div
          className={`grid gap-1 ${
            message.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
          }`}
        >
          {message.images.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt='message photo'
              width={100}
              height={100}
            />
          ))}
        </div>
      );
    }
    return null;
  };

  if (sender?._id === currentUserData?._id) {
    return (
      <div className='flex justify-end gap-2'>
        <div className='flex flex-col gap-2'>
          <div className='bg-primary py-2 px-5 rounded-xl rounded-tl-none'>
            {message.text && (
              <p className='text-white text-sm'>{message.text}</p>
            )}
            {messageImages()}
          </div>
          <div className='flex justify-between items-center gap-2'>
            <span className='text-xs text-gray-500'>
              {formatDateTime(message.createdAt)}
            </span>
            <i
              className={`ri-check-double-line ${
                read ? 'text-blue-500' : 'text-gray-500'
              }`}
            ></i>
          </div>
        </div>
        <Avatar
          src={sender.profilePicture}
          alt='avatar'
          className='w-6 h-6 rounded-full'
        />
      </div>
    );
  } else {
    return (
      <div className='flex gap-2'>
        <Avatar
          src={sender.profilePicture}
          alt='avatar'
          className='w-6 h-6 rounded-full'
        />

        <div className='flex flex-col gap-2'>
          <div className='bg-gray-200 py-2 px-7 rounded-xl rounded-tr-none'>
            <span className='text-blue-500 text-xs font-semibold'>
              {sender?.name}
            </span>
            {message.text && (
              <p className='text-black m-0 pt-1 text-sm'>{message.text}</p>
            )}
            {messageImages()}
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
