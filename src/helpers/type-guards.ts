import { UserType } from '@/interfaces';
import { ChatType } from '@/interfaces/chat';
import { MessageType } from '@/interfaces/message';

// User Guards
export function assertHasUser(
  userData: UserType | null
): asserts userData is UserType {
  if (userData === null) {
    throw new Error('User is not in state');
  }
}

export function assertUserIsUpdated(
  userReponse: { error: string } | UserType
): asserts userReponse is UserType {
  if ('error' in userReponse) {
    throw new Error(userReponse.error);
  }
}

export function assertUsersAreGotten(
  userReponse: { error: string } | UserType[]
): asserts userReponse is UserType[] {
  if ('error' in userReponse) {
    throw new Error(userReponse.error);
  }
}

// Chat Guards
export function assertChatisCreated(
  chatReponse: { error: string } | ChatType
): asserts chatReponse is ChatType {
  if ('error' in chatReponse) {
    throw new Error(chatReponse.error);
  }
}

export function assertChatsAreGotten(
  chatReponse: { error: string } | ChatType[]
): asserts chatReponse is ChatType[] {
  if ('error' in chatReponse) {
    throw new Error(chatReponse.error);
  }
}

// Message Guards
export function assertMessageIsSent(
  messageReponse: { error: string } | MessageType
): asserts messageReponse is MessageType {
  if ('error' in messageReponse) {
    throw new Error(messageReponse.error);
  }
}

export function assertMessagesAreGotten(
  messageReponse: { error: string } | MessageType[]
): asserts messageReponse is MessageType[] {
  if ('error' in messageReponse) {
    throw new Error(messageReponse.error);
  }
}
