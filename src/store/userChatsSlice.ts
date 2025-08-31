import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserChatT } from "../types/appTypes";

interface UserChatsStateT {
  value: UserChatT[];
  activeChat: UserChatT | null;
}

const initialState: UserChatsStateT = { value: [], activeChat: null };

const userChatsSlice = createSlice({
  name: "userChats",
  initialState,
  reducers: {
    setUserChats: (state, action: PayloadAction<UserChatT[]>) => {
      state.value = action.payload;
    },
    setActiveChat: (state, action: PayloadAction<UserChatT>) => {
      state.activeChat = action.payload;
    },
    setUserPresence: (state, action) => {
      const { username, presence, last_seen = undefined } = action.payload;

      const userChats = state.value;

      const indexOfUser = userChats.findIndex(
        (uc) => uc.partner?.username === username,
      );

      if (indexOfUser > -1 && userChats[indexOfUser].partner) {
        userChats[indexOfUser].partner.presence = presence;
        userChats[indexOfUser].partner.last_seen = last_seen;
      }

      state.value = userChats;

      // -----------------
      
      const activeChat = state.activeChat

      if (activeChat?.partner && activeChat.partner.username === username) {
        activeChat.partner.presence = presence;
        activeChat.partner.last_seen = last_seen;
      }

      state.activeChat = activeChat
    },
  },
});

export const { setUserChats, setActiveChat, setUserPresence } =
  userChatsSlice.actions;
export default userChatsSlice.reducer;
