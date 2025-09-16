'use server';

import { MessageType } from '@/interfaces/message';
import ChatModel from '@/models/chat-model';
import MessageModel from '@/models/message-model';

export const sendMessage = async (message: Partial<MessageType>) => {
  try {
    const newMessage = new MessageModel(message);
    await newMessage.save();

    const existingChat = await ChatModel.findById(message.chat);
    const unreadCounts = existingChat?.unreadCounts;

    existingChat?.users.forEach((userId) => {
      const userIdStr = userId.toString();
      if (userIdStr !== message.sender?.toString()) {
        unreadCounts[userIdStr] = (unreadCounts[userIdStr] || 0) + 1;
      }
    });
    await ChatModel.findByIdAndUpdate(message.chat, {
      lastMessage: newMessage._id,
      unreadCounts,
      lastMessageAt: new Date(),
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

export const readAllMessages = async (chatId: string, userId: string) => {
  try {
    // push userIds to readBy array if not already present
    await MessageModel.updateMany(
      { chat: chatId, sender: { $ne: userId }, readBy: { $nin: [userId] } },
      { $addToSet: { readBy: userId } }
    );

    const existingChat = await ChatModel.findById(chatId);
    const unreadCounts = existingChat?.unreadCounts;
    const newUnreadCounts = { ...unreadCounts, [userId]: 0 };

    await ChatModel.findByIdAndUpdate(chatId, {
      unreadCounts: newUnreadCounts,
    });
    return { message: 'Messages marked as read' };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
  }
};
