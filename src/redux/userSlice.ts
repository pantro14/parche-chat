import { UserType } from '@/interfaces';
import { createSlice } from '@reduxjs/toolkit';

export type UserState = {
  currentUserData: UserType | null;
  currentUserId: string;
  onlineUsers: string[]; // Array of online user IDs
};

const initialState: UserState = {
  currentUserData: null,
  currentUserId: '',
  onlineUsers: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    SetCurrentUser(state, action) {
      state.currentUserData = action.payload;
    },
    SetCurrentUserId(state, action) {
      state.currentUserId = action.payload;
    },
    SetOnlineUsers(state, action) {
      state.onlineUsers = action.payload;
    },
  },
});

export const { SetCurrentUser, SetCurrentUserId, SetOnlineUsers } =
  userSlice.actions;

export default userSlice;
