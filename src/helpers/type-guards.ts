import { UserType } from '@/interfaces';

export function assertUserIsUpdated(
  userReponse: { error: string } | UserType
): asserts userReponse is UserType {
  if ('error' in userReponse) {
    throw new Error(userReponse.error);
  }
}
