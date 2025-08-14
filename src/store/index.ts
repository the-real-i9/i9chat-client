import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./userSlice"
import userChatsReducer from "./userChatsSlice"
import userToChatHistoryMapReducer from "./userToChatHistoryMapSlice"

const store = configureStore({
  reducer: {
    user: userReducer,
    userChats: userChatsReducer,
    userToChatHistoryMap: userToChatHistoryMapReducer,
  },
})

export default store
export type RootState = ReturnType<typeof store.getState>;
