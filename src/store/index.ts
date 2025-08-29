import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import userChatsReducer from "./userChatsSlice";
import userToChatHistoryMapReducer from "./userToChatHistoryMapSlice";
import recentUsersReducer from "./recentUsersSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    userChats: userChatsReducer,
    userToChatHistoryMap: userToChatHistoryMapReducer,
    recentUsers: recentUsersReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
