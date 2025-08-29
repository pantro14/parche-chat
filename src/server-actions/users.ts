'use server';
import connectMongoDB from '@/config/db-config';
import UserModel from '@/models/user-model';
import { currentUser } from '@clerk/nextjs/server';

export const getCurrentinUserFromDB = async () => {
  try {
    await connectMongoDB();
    const clerkUser = await currentUser();
    const mongoUser = await UserModel.findOne({ clerkUserId: clerkUser?.id });
    if (mongoUser) {
      return JSON.parse(JSON.stringify(mongoUser));
    }
    const newUser = await UserModel.create({
      clerkUserId: clerkUser?.id,
      name: clerkUser?.fullName || '',
      username: clerkUser?.username || `user${Date.now()}`,
      email: clerkUser?.emailAddresses?.[0]?.emailAddress || '',
      profilePicture: clerkUser?.imageUrl || '',
      bio: '',
    });
    return JSON.parse(JSON.stringify(newUser));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch ({ message }: any) {
    return {
      error: message,
    };
  }
};
