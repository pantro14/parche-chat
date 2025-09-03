import { UserType } from '@/interfaces';
import { createSlice } from '@reduxjs/toolkit';

export type UserState = {
  currentUserData: UserType | null;
  currentUserId: string;
};

const initialState: UserState = {
  currentUserData: null,
  currentUserId: '',
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
  },
});

export const { SetCurrentUser, SetCurrentUserId } = userSlice.actions;

export default userSlice;
