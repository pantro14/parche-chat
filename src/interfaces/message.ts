import { ChatType } from './chat';
import { UserType } from './user';

export type MessageType = {
  _id: string;
  chat: ChatType | ChatType['_id'];
  sender: UserType;
  text: string;
  images: string[];
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
};
