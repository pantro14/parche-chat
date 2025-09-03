import { ChatState } from '@/redux/chatSlice';
import { RootState } from '@/redux/store';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import MessageEditor from './message-edtior';
import Messages from './messages';
import Recipient from './recipient';

function ChatArea() {
  const { selectedChat }: ChatState = useSelector(
    (state: RootState) => state.chats
  );
  return selectedChat ? (
    <div className='flex-1 flex flex-col justify-between'>
      <Recipient />
      <Messages />
      <MessageEditor />
    </div>
  ) : (
    <div className='flex-1 flex flex-col justify-center items-center h-full'>
      <Image
        src='https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzMxeFBzM0NuWTg0N29QVThuTzUyRHMxT25OUiJ9?width=400'
        alt='Chat logo'
        width={300}
        height={300}
      />
      <span className='font-semibold text-gray-600 text-sm'>
        Select a chat to start messaging...
      </span>
    </div>
  );
}

export default ChatArea;
