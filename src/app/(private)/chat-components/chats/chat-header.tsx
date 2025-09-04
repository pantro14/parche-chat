import { Dropdown, Input, MenuProps } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import NewChatModal from './new-chat-modal';

function ChatHeader() {
  const [showChatModal, setShowChatModal] = useState(false);

  const router = useRouter();
  const items: MenuProps['items'] = [
    {
      label: 'New Chat',
      key: '1',
      onClick: () => {
        setShowChatModal(true);
      },
    },
    {
      label: 'New Group',
      key: '2',
      onClick: () => router.push('/groups/create-group'),
    },
  ];
  return (
    <div className='my-2 space-y-5'>
      <div className='flex justify-between items-center'>
        <h1 className='text-xl text-gray-500 font-bold uppercase'>My Chats</h1>
        <Dropdown.Button
          size='small'
          style={{ width: 'max-content' }}
          menu={{ items }}
        >
          New
        </Dropdown.Button>{' '}
      </div>

      <Input placeholder='Search a chat...' />

      {showChatModal && (
        <NewChatModal
          showNewChatModal={showChatModal}
          setShowNewChatModal={setShowChatModal}
        />
      )}
    </div>
  );
}

export default ChatHeader;
