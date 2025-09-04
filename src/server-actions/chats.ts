'use server';

import { ChatType } from '@/interfaces/chat';
import ChatModel from '@/models/chat-model';

export const createNewChat = async (chat: Partial<ChatType>) => {
  try {
    await ChatModel.create(chat);
    const newChats = await ChatModel.find({
      users: { $in: [chat.createdBy] },
    })
      .populate('users')
      .sort({ updatedAt: -1 });
    return JSON.parse(JSON.stringify(newChats));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
  }
};

export const getChatsByUserId = async (userId: string) => {
  try {
    const users = await ChatModel.find({ users: { $in: [userId] } })
      .populate('users')
      .populate('lastMessage')
      .populate('createdBy')
      .populate({ path: 'lastMessage', populate: { path: 'sender' } })
      .sort({ updatedAt: -1 });
    await new Promise((resolve) => setTimeout(resolve, 2000)); // TODO: Remove this line
    return JSON.parse(JSON.stringify(users));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
  }
};

export const getChatDataById = async (chatId: string) => {
  try {
    const chat = await ChatModel.findById(chatId)
      .populate('users')
      .populate('lastMessage')
      .populate('createdBy')
      .populate({ path: 'lastMessage', populate: { path: 'sender' } });
    return JSON.parse(JSON.stringify(chat));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
  }
};

export const updateChat = async (
  chatId: string,
  updatedData: Partial<ChatType>
) => {
  try {
    const updatedChat = await ChatModel.findByIdAndUpdate(chatId, updatedData, {
      new: true,
    });
    return JSON.parse(JSON.stringify(updatedChat));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
  }
};
