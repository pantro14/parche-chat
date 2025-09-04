import { formatDateTime } from '@/helpers/date-format';
import { UserType } from '@/interfaces';
import { ChatState } from '@/redux/chatSlice';
import { RootState } from '@/redux/store';
import { UserState } from '@/redux/userSlice';
import { Avatar, Button, Divider, Drawer } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import { useSelector } from 'react-redux';

interface RecipientInfoProps {
  showRecipientInfo: boolean;
  setShowRecipientInfo: Dispatch<SetStateAction<boolean>>;
}
function RecipientInfo({
  showRecipientInfo,
  setShowRecipientInfo,
}: RecipientInfoProps) {
  const { selectedChat }: ChatState = useSelector(
    (state: RootState) => state.chats
  );

  const {
    isGroupChat,
    users,
    groupName,
    groupProfilePicture,
    lastMessage: lastChatMessage,
  } = selectedChat!;

  const { currentUserData }: UserState = useSelector(
    (state: RootState) => state.user
  );

  const recipient = !isGroupChat
    ? (users as UserType[]).find((user) => user._id !== currentUserData?._id)
    : null;

  const chatName = isGroupChat ? groupName : recipient?.name;
  const chatImage = isGroupChat
    ? groupProfilePicture
    : recipient?.profilePicture;

  const getProperty = (key: string, value: string) => {
    return (
      <div className='flex flex-col'>
        <span className='font-semibold text-gray-700'>{key}</span>
        <span className='text-gray-600'>{value}</span>
      </div>
    );
  };

  const router = useRouter();

  return (
    <Drawer
      open={showRecipientInfo}
      onClose={() => setShowRecipientInfo(false)}
      title={isGroupChat ? 'Group chat info' : 'Chat info'}
    >
      <div className='flex justify-center flex-col gap-5 items-center'>
        <Image
          src={chatImage!}
          width={120}
          height={120}
          alt='profile'
          className='rounded-full object-cover'
        />
        <span className='text-gray-700 text-sm'>{chatName}</span>
      </div>

      <Divider className='my-1 border-gray-200' />

      {isGroupChat && (
        <div className='flex flex-col gap-5 mt-5'>
          <div className='flex justify-between'>
            <span className=' text-gray-500 text-sm'>
              {users.length} Members
            </span>
            <Button
              type='primary'
              size='small'
              onClick={() =>
                router.push(`/groups/edit-group/${selectedChat!._id}`)
              }
            >
              Edit Group
            </Button>
          </div>
          {(users as UserType[]).map((user) => (
            <div key={user._id} className='flex items-center gap-5'>
              <Avatar src={user.profilePicture} size='large' />
              <span className='text-gray-700 text-sm'>{user.name}</span>
            </div>
          ))}
        </div>
      )}

      <Divider className='my-1 border-gray-200' />

      <div className='flex flex-col gap-5'>
        {getProperty('Created On', formatDateTime(selectedChat!.createdAt))}
        {getProperty('Created By', (selectedChat!.createdBy as UserType).name)}
      </div>
    </Drawer>
  );
}

export default RecipientInfo;
