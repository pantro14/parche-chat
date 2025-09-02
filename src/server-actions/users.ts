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
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
  }
};

export const updateUserProfilePicture = async (
  userId: string,
  profilePicture: string
) => {
  try {
    await connectMongoDB();
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { profilePicture },
      { new: true }
    );
    if (updatedUser) {
      return JSON.parse(JSON.stringify(updatedUser));
    }
    throw new Error('User not found');
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
  }
};
