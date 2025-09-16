import { formatDateTime } from '@/helpers/date-format';
import { UserType } from '@/interfaces';
import { MessageType } from '@/interfaces/message';
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

  const sender = message.sender as UserType;

  if (sender?._id === currentUserData?._id) {
    return (
      <div className='flex justify-end gap-2'>
        <div className='flex flex-col gap-2'>
          <div className='bg-primary py-2 px-5 rounded-xl rounded-tl-none'>
            {message.text && (
              <p className='text-white text-sm'>{message.text}</p>
            )}
            {message.images && message.images.length > 0 && (
              <Image
                src={message.images[0]}
                alt='message photo'
                width={100}
                height={100}
              />
            )}
          </div>
          <span className='text-xs text-gray-500'>
            {formatDateTime(message.createdAt)}
          </span>
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
            {message.images && message.images.length > 0 && (
              <Image
                src={message.images[0]}
                alt='message photo'
                width={100}
                height={100}
              />
            )}
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
