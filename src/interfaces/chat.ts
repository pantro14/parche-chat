import { MessageType } from './message';
import { UserType } from './user';

export interface ChatType {
  _id: string;
  users: UserType[] | string[];
  createdBy: UserType | UserType['_id'];
  lastMessage: MessageType | MessageType['_id'];
  isGroupChat: boolean;
  groupName: string;
  groupProfilePicture: string;
  groupBio: string;
  groupAdmins: UserType['_id'][];
  unreadCounts: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

export type ChatGrouptForm = Pick<ChatType, 'groupName' | 'groupBio'>;
