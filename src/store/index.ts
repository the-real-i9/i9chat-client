import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./userSlice"
import userChatsReducer from "./userChatsSlice"
import chatIdentToHistoryMapReducer from "./chatIdentToHistoryMapSlice"
import recentUsersReducer from "./recentUsersSlice"
import appTabsReducer from "./appTabsSlice"

const store = configureStore({
  reducer: {
    user: userReducer,
    userChats: userChatsReducer,
    chatIdentToHistoryMap: chatIdentToHistoryMapReducer,
    recentUsers: recentUsersReducer,
    appTabs: appTabsReducer,
  },
})

export default store
export type RootState = ReturnType<typeof store.getState>
