import ChatHeader from './chat-header';
import ChatList from './chat-lists';

function Chats() {
  return (
    <div className='w-[40%] lg:w-[50%] h-full p-3'>
      <ChatHeader />
      <ChatList />
    </div>
  );
}

export default Chats;
