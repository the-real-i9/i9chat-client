import { createSlice } from "@reduxjs/toolkit"

const userChatHistorySlice = createSlice({
  name: "userChatHistory",
  initialState: {
    value: new Map(),
  },
  reducers: {
    setUserChatHistory: (state, action) => {
      state.value = action.payload
    },
  },
})

export const { setUserChatHistory } = userChatHistorySlice.actions
export default userChatHistorySlice.reducer
