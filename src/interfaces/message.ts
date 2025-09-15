import { ChatType } from './chat';
import { UserType } from './user';

export type MessageType = {
  _id: string;
  socketMessageId: string;
  chat: ChatType | ChatType['_id'];
  sender: UserType | string;
  text: string;
  images: string[];
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
};
