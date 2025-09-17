import socket from '@/config/socket';
import { assertChatsAreGotten, assertHasUser } from '@/helpers/type-guards';
import { UserType } from '@/interfaces';
import { ChatType } from '@/interfaces/chat';
import { MessageType } from '@/interfaces/message';
import { ChatState, SetChats } from '@/redux/chatSlice';
import store, { RootState } from '@/redux/store';
import { UserState } from '@/redux/userSlice';
import { getChatsByUserId } from '@/server-actions/chats';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatCard from './chat-card';
import ChatCardSkeleton from './chat-card-skeleton';

function ChatList() {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const { selectedChat }: ChatState = useSelector(
    (state: RootState) => state.chats
  );
  const { currentUserData }: UserState = useSelector(
    (state: RootState) => state.user
  );
  const { chats }: ChatState = useSelector((state: RootState) => state.chats);

  const getChats = async () => {
    try {
      setLoading(true);
      assertHasUser(currentUserData);
      const response = await getChatsByUserId(currentUserData._id);
      assertChatsAreGotten(response);
      dispatch(SetChats(response));
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserData) {
      getChats();
    }
  }, [currentUserData]);

  useEffect(() => {
    socket.on('new-message-received', (newMessage: MessageType) => {
      const { chats, selectedChat }: ChatState = store.getState().chats;
      const { currentUserData }: UserState = store.getState().user;

      const newMessageChat = newMessage.chat as ChatType;

      // If there are no chats, add in the list
      if (chats.length === 0 && !selectedChat) {
        const chatCopy: ChatType = {
          ...newMessageChat,
          lastMessage: newMessage,
          updatedAt: newMessage.createdAt,
          unreadCounts: {
            [currentUserData!._id as string]: 1,
          },
        };
        dispatch(SetChats([chatCopy]));
        return;
      }

      const existingChat = chats.find(
        (chat) => chat._id === newMessageChat._id
      );
      const isSameMessage =
        existingChat?.lastMessage &&
        (existingChat?.lastMessage as MessageType).socketMessageId ===
          newMessage.socketMessageId;

      if (existingChat && !isSameMessage) {
        // Update last message of the chat
        const chatCopy: ChatType = {
          ...existingChat,
          lastMessage: newMessage,
          updatedAt: newMessage.createdAt,
        };

        // Update unread counts
        const messageSender = newMessage.sender as UserType;
        const isMessageSenderAnotherUser =
          messageSender._id !== currentUserData?._id;
        const isMessageFromAnotherChat =
          selectedChat?._id !== newMessageChat._id;

        if (isMessageSenderAnotherUser || isMessageFromAnotherChat) {
          chatCopy.unreadCounts = {
            ...chatCopy.unreadCounts,
            [currentUserData?._id as string]:
              (chatCopy.unreadCounts[currentUserData!._id] || 0) + 1,
          };
        }

        // Put the updated chat to the first position
        const filteredChats = chats.filter(
          (chat) => chat._id !== existingChat._id
        );
        dispatch(SetChats([chatCopy, ...filteredChats]));
      }
    });
    return () => {
      socket.off('new-message-received');
    };
  }, [selectedChat]);

  return (
    <div>
      {loading ? (
        <div className='flex py-2 flex-col'>
          {Array.from(Array(5).keys()).map((key) => (
            <ChatCardSkeleton key={key} />
          ))}
        </div>
      ) : (
        chats.length > 0 && (
          <div className='flex py-2 flex-col'>
            {chats.map((chat) => (
              <ChatCard chat={chat} key={chat._id} />
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default ChatList;
