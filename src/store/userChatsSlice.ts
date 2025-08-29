import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserChatT } from "../types/appTypes";

interface UserChatsStateT {
  value: UserChatT[];
  activeChatIdent: string;
}

const initialState: UserChatsStateT = { value: [], activeChatIdent: "" };

const userChatsSlice = createSlice({
  name: "userChats",
  initialState,
  reducers: {
    setUserChats: (state, action: PayloadAction<UserChatT[]>) => {
      state.value = action.payload;
    },
    setActiveChat: (state, action: PayloadAction<string>) => {
      state.activeChatIdent = action.payload;
    },
    setUserPresence: (state, action) => {
      const { username, presence, last_seen = undefined } = action.payload;

      const oldUserChats = state.value;

      const indexOfUser = oldUserChats.findIndex(
        (ouc) => ouc.partner?.username === username,
      );

      if (indexOfUser > -1 && oldUserChats[indexOfUser].partner) {
        oldUserChats[indexOfUser].partner.presence = presence;
        oldUserChats[indexOfUser].partner.last_seen = last_seen;
      }

      state.value = oldUserChats;
    },
  },
});

export const { setUserChats, setActiveChat, setUserPresence } =
  userChatsSlice.actions;
export default userChatsSlice.reducer;
