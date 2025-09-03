import { assertChatsAreGotten, assertHasUser } from '@/helpers/type-guards';
import { ChatState, SetChats } from '@/redux/chatSlice';
import { RootState } from '@/redux/store';
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
      console.log(response);
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

  return (
    <div>
      {chats.length > 0 && (
        <div className='flex py-2 flex-col'>
          {chats.map((chat) => (
            <ChatCard chat={chat} key={chat._id} />
          ))}
        </div>
      )}
      {loading && (
        <div className='flex py-2 flex-col'>
          {Array.from(Array(5).keys()).map((key) => (
            <ChatCardSkeleton key={key} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatList;
