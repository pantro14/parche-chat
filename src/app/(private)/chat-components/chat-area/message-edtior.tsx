import { assertMessageIsSent } from '@/helpers/type-guards';
import { ChatState } from '@/redux/chatSlice';
import { RootState } from '@/redux/store';
import { UserState } from '@/redux/userSlice';
import { sendMessage } from '@/server-actions/messages';
import { Button, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

function MessageEditor() {
  const [text, setText] = useState<string>('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { selectedChat }: ChatState = useSelector(
    (state: RootState) => state.chats
  );
  const { currentUserData }: UserState = useSelector(
    (state: RootState) => state.user
  );

  const onSendMessage = async () => {
    if (!text.trim()) return;
    try {
      const response = await sendMessage({
        text,
        images: [],
        sender: currentUserData!._id,
        chat: selectedChat?._id,
      });
      assertMessageIsSent(response);
      setText('');
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedChat]);

  return (
    <div className='p-3 bg-gray-100 border-0 border-t border-solid border-gray-200 flex gap-5'>
      <div>{/* Emojis */}</div>
      <div className='flex-1'>
        <TextArea
          rows={1}
          placeholder='Type a message'
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          ref={inputRef}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              onSendMessage();
            }
          }}
        />
      </div>
      <Button type='primary' style={{ height: '32px' }} onClick={onSendMessage}>
        Send
      </Button>
    </div>
  );
}

export default MessageEditor;
