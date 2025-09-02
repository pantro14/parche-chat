import { ChatType } from './chat';

export type MessageType = {
  _id: string;
  chat: ChatType;
  sender: string;
  text: string;
  images: string[];
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
};
