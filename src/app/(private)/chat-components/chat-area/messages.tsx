import { assertMessagesAreGotten } from '@/helpers/type-guards';
import { MessageType } from '@/interfaces/message';
import { ChatState } from '@/redux/chatSlice';
import { RootState } from '@/redux/store';
import { UserState } from '@/redux/userSlice';
import { getChatMessages, readAllMessages } from '@/server-actions/messages';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MessagePopup from './messasge-popup';

function Messages() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { selectedChat }: ChatState = useSelector(
    (state: RootState) => state.chats
  );
  const { currentUserData }: UserState = useSelector(
    (state: RootState) => state.user
  );

  const getMessages = async () => {
    try {
      setLoading(true);
      const response = await getChatMessages(selectedChat!._id);
      assertMessagesAreGotten(response);
      console.log(response);
      setMessages(response);
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      getMessages();
      readAllMessages(selectedChat?._id, currentUserData!._id);
    }
  }, [selectedChat]);

  return (
    <div className='flex-1 p-3 overflow-y-auto scrollbar-hide'>
      <div className='flex flex-col gap-3'>
        {messages.map((message) => {
          return <MessagePopup key={message._id} message={message} />;
        })}
      </div>
    </div>
  );
}

export default Messages;
