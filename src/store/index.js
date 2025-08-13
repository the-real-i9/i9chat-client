import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./userSlice"
import chatsReducer from "./chatsSlice"
import userChatHistoryReducer from "./userChatHistorySlice"

const store = configureStore({
  reducer: {
    user: userReducer,
    chats: chatsReducer,
    userChatHistory: userChatHistoryReducer,
  },
})

export default store
