import socket from '@/config/socket';
import uploadNewImage from '@/helpers/image';
import { ChatState } from '@/redux/chatSlice';
import { RootState } from '@/redux/store';
import { UserState } from '@/redux/userSlice';
import { sendMessage } from '@/server-actions/messages';
import { Button, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import EmojiPicker from 'emoji-picker-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import ImagePicker from './image-picker';

function MessageEditor() {
  const [text, setText] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showImagePicker, setShowImagePicker] = useState<boolean>(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { selectedChat }: ChatState = useSelector(
    (state: RootState) => state.chats
  );
  const { currentUserData }: UserState = useSelector(
    (state: RootState) => state.user
  );

  const onSendMessage = async () => {
    if (!text.trim() && imageFiles.length === 0) return;
    try {
      // upload images if there are
      const images = [];
      if (imageFiles.length > 0) {
        setUploading(true);
        for (const file of imageFiles) {
          const { secure_url: imageUrl } = await uploadNewImage(file);
          images.push(imageUrl);
        }
        setUploading(false);
      }

      const commonPayload = {
        text,
        images,
        socketMessageId: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        readBy: [],
      };

      // Socket comunication
      socket.emit('send-new-message', {
        ...commonPayload,
        sender: currentUserData,
        chat: selectedChat,
      });

      // REST API comunication
      sendMessage({
        ...commonPayload,
        sender: currentUserData!._id,
        chat: selectedChat?._id,
      });

      // clean up
      setText('');
      setShowEmojiPicker(false);
      setShowImagePicker(false);
      setImageFiles([]);
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
    return () => {
      setText('');
    };
  }, [selectedChat]);

  useEffect(() => {
    socket.emit('typing', {
      chat: selectedChat,
      senderId: currentUserData!._id,
      senderName: currentUserData!.name,
    });
  }, [currentUserData, selectedChat, text]);

  return (
    <div className='p-3 bg-gray-100 border-0 border-t border-solid border-gray-200 flex gap-2 relative items-center'>
      <div className='flex gap-2'>
        {showEmojiPicker && (
          <div className='absolute left-2 bottom-12'>
            <EmojiPicker
              height={350}
              onEmojiClick={(emojiObject) => {
                setText((prev) => prev + emojiObject.emoji);
              }}
            />
          </div>
        )}
        <Button
          className='bg-gray-200'
          style={{ height: '32px' }}
          onClick={() => setShowImagePicker(!showImagePicker)}
        >
          <i className='ri-camera-line'></i>
        </Button>
        <Button
          className='bg-gray-200'
          style={{ height: '32px' }}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <i className='ri-emoji-sticker-line'></i>
        </Button>
      </div>
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
      {showImagePicker && (
        <ImagePicker
          showImagePicker={showImagePicker}
          setShowImagePicker={setShowImagePicker}
          imageFiles={imageFiles}
          setImageFiles={setImageFiles}
          onSend={onSendMessage}
          uploading={uploading}
        />
      )}
    </div>
  );
}

export default MessageEditor;
