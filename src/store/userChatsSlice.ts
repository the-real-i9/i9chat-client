import { createSlice } from "@reduxjs/toolkit"
import type { UserChatT } from "../types/appTypes"

const initialState: {
  value: UserChatT[],
  activeChat: string | null
} = { value: [], activeChat: null }

const userChatsSlice = createSlice({
  name: "userChats",
  initialState,
  reducers: {
    setUserChats: (state, action) => {
      state.value = action.payload
    },
    setActiveChat: (state, action) => {
      state.activeChat = action.payload
    }
  },
})

export const { setUserChats, setActiveChat } = userChatsSlice.actions
export default userChatsSlice.reducer
