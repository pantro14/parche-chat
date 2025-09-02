import { MessageType } from './message';
import { UserType } from './user';

export interface ChatType {
  _id: string;
  users: UserType[];
  createdBy: UserType;
  lastMessage: MessageType;
  isGroupChat: boolean;
  groupName: string;
  groupProfilePicture: string;
  groupBio: string;
  groupAdmins: UserType[];
  unreadCount?: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
}
