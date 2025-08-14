import { createSlice } from "@reduxjs/toolkit"
import type { UserChatT } from "../types/appTypes"

const initialState: {
  value: UserChatT[]
} = { value: [] }

const userChatsSlice = createSlice({
  name: "userChats",
  initialState,
  reducers: {
    setUserChats: (state, action) => {
      state.value = action.payload
    },
  },
})

export const { setUserChats } = userChatsSlice.actions
export default userChatsSlice.reducer
