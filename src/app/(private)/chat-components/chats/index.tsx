import ChatHeader from './chat-header';
import ChatList from './chat-lists';

function Chats() {
  return (
    <div className='w-[400px] h-full p-3'>
      <ChatHeader />
      <ChatList />
    </div>
  );
}

export default Chats;
