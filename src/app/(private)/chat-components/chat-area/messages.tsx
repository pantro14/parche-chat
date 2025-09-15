import socket from '@/config/socket';
import { assertMessagesAreGotten } from '@/helpers/type-guards';
import { ChatType } from '@/interfaces/chat';
import { MessageType } from '@/interfaces/message';
import { ChatState } from '@/redux/chatSlice';
import { RootState } from '@/redux/store';
import { UserState } from '@/redux/userSlice';
import { getChatMessages, readAllMessages } from '@/server-actions/messages';
import { message } from 'antd';
import { useEffect, useRef, useState } from 'react';
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

  const messagesRef = useRef<HTMLDivElement>(null);

  const getMessages = async () => {
    try {
      setLoading(true);
      const response = await getChatMessages(selectedChat!._id);
      assertMessagesAreGotten(response);
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

  useEffect(() => {
    socket.on('new-message-received', (message: MessageType) => {
      if (selectedChat?._id === (message.chat as ChatType)._id) {
        setMessages((prevMessages) => {
          const isMessageExists = prevMessages.some(
            (msg) => msg.socketMessageId === message.socketMessageId
          );
          return [...prevMessages, ...(isMessageExists ? [] : [message])];
        });
      }
    });
  }, [selectedChat]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className='flex-1 p-3 overflow-y-auto scrollbar-hide'
      ref={messagesRef}
    >
      <div className='flex flex-col gap-3'>
        {messages.map((message) => {
          return (
            <MessagePopup key={message.socketMessageId} message={message} />
          );
        })}
      </div>
    </div>
  );
}

export default Messages;
