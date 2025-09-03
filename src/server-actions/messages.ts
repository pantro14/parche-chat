'use server';

import { MessageType } from '@/interfaces/message';
import ChatModel from '@/models/chat-model';
import MessageModel from '@/models/message-model';

export const sendMessage = async (message: Partial<MessageType>) => {
  try {
    const newMessage = new MessageModel(message);
    await newMessage.save();
    await ChatModel.findByIdAndUpdate(message.chat, {
      lastMessage: newMessage._id,
    });
    return JSON.parse(JSON.stringify(newMessage));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
  }
};

export const getChatMessages = async (chatId: string) => {
  try {
    const messages = await MessageModel.find({ chat: chatId })
      .populate('sender')
      .sort({ createdAt: 1 });
    return JSON.parse(JSON.stringify(messages));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
  }
};
