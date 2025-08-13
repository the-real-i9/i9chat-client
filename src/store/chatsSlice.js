import { createSlice } from "@reduxjs/toolkit"

const chatsSlice = createSlice({
  name: "chats",
  initialState: {
    value: [],
  },
  reducers: {
    setChats: (state, action) => {
      state.value = action.payload
    },
  },
})

export const { setChats } = chatsSlice.actions
export default chatsSlice.reducer
