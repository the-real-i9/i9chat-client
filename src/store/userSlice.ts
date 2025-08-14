import { createSlice } from "@reduxjs/toolkit"

import type { UserT } from "../types/appTypes"

const initialState: {
  value: UserT | null
} = { value: null }

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.value = action.payload
    },
  },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
