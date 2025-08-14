import { createSlice } from "@reduxjs/toolkit"
import type { ChatHistoryEntryT } from "../types/appTypes"

const initialState: {
  value: Record<string, ChatHistoryEntryT[]>
} = { value: {} }

const userToChatHistoryMapSlice = createSlice({
  name: "userToChatHistoryMap",
  initialState,
  reducers: {
    setUserToChatHistoryMap: (state, action) => {
      state.value = action.payload
    },
  },
})

export const { setUserToChatHistoryMap } = userToChatHistoryMapSlice.actions
export default userToChatHistoryMapSlice.reducer
