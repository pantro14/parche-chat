import { formatDateTime } from '@/helpers/date-format';
import { UserType } from '@/interfaces';
import { ChatType } from '@/interfaces/chat';
import { MessageType } from '@/interfaces/message';
import { ChatState, SetSelectedChat } from '@/redux/chatSlice';
import { RootState } from '@/redux/store';
import { UserState } from '@/redux/userSlice';
import { Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

interface ChatCardProps {
  chat: ChatType;
}

function ChatCard({ chat }: ChatCardProps) {
  const {
    isGroupChat,
    users,
    groupName,
    groupProfilePicture,
    lastMessage: lastChatMessage,
  } = chat;
  const { currentUserData }: UserState = useSelector(
    (state: RootState) => state.user
  );
  const { selectedChat }: ChatState = useSelector(
    (state: RootState) => state.chats
  );

  const dispatch = useDispatch();

  const recipient = !isGroupChat
    ? (users as UserType[]).find((user) => user._id !== currentUserData?._id)
    : null;

  const chatName = isGroupChat ? groupName : recipient?.name;
  const chatImage = isGroupChat
    ? groupProfilePicture
    : recipient?.profilePicture;

  let lastMessage = '';
  let lastMessageSenderName = '';
  let lastMessageTime = '';
  if (lastChatMessage) {
    const { text, sender, createdAt } = lastChatMessage! as MessageType;
    const userSender = sender as UserType;
    lastMessage = text;
    lastMessageSenderName =
      userSender._id === currentUserData?._id
        ? 'You: '
        : `${userSender.name.split(' ')[0]}: `;
    lastMessageTime = formatDateTime(createdAt);
  }

  const unreadCounts = () => {
    if (!chat.unreadCounts || !chat.unreadCounts[currentUserData!._id]) {
      return <div className='flex-1'></div>;
    }

    return (
      <div className='bg-green-700 h-5 w-5 flex justify-center items-center rounded-full'>
        <span className='text-white text-xs'>
          {chat.unreadCounts[currentUserData!._id]}
        </span>
      </div>
    );
  };

  return (
    <div
      className={`flex justify-between hover:bg-gray-100 py-3 px-2 rounded cursor-pointer ${
        selectedChat?._id === chat._id
          ? 'bg-gray-100 border border-gray-200 border-solid'
          : ''
      }`}
      onClick={() => dispatch(SetSelectedChat(chat))}
    >
      <div className='flex gap-5 items-center'>
        <Avatar src={chatImage} size='large'></Avatar>
        <div className='flex flex-col gap-1'>
          <span className='text-gray-700 text-sm'>{chatName}</span>
          <span className='text-gray-400 text-xs truncate w-70'>
            {''}
            {lastMessageSenderName} {lastMessage}
          </span>
        </div>
      </div>
      <div className='flex flex-col gap-2 items-end'>
        <span className='text-xs text-gray-500 '>{lastMessageTime}</span>
        {unreadCounts()}
      </div>
    </div>
  );
}

export default ChatCard;
