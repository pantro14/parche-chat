import { configureStore } from '@reduxjs/toolkit';
import chatSlice from './chatSlice';
import userSlice from './userSlice';

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    chats: chatSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
