import { ChatType } from '@/interfaces/chat';
import { createSlice } from '@reduxjs/toolkit';

export type ChatState = {
  chats: ChatType[];
  selectedChat?: ChatType | null;
};

const initialState: ChatState = {
  chats: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    SetChats(state, action) {
      state.chats = action.payload;
    },
    SetSelectedChat(state, action) {
      state.selectedChat = action.payload;
    },
  },
});

export const { SetChats, SetSelectedChat } = chatSlice.actions;

export default chatSlice;
