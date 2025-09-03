import { MessageType } from './message';
import { UserType } from './user';

export interface ChatType {
  _id: string;
  users: UserType[] | string[];
  createdBy: UserType['_id'];
  lastMessage: MessageType['_id'];
  isGroupChat: boolean;
  groupName: string;
  groupProfilePicture: string;
  groupBio: string;
  groupAdmins: UserType['_id'][];
  unreadCount: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
}
