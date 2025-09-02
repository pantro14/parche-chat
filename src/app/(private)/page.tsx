'use client';

import { Divider } from 'antd';
import ChatArea from './chat-components/chat-area';
import Chats from './chat-components/chats';

export default function Home() {
  return (
    <div className='flex h-[85vh]'>
      <Chats />
      <Divider style={{ height: 'auto' }} type='vertical' />
      <ChatArea />
    </div>
  );
}
