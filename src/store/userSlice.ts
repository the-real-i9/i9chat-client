import { createSlice } from "@reduxjs/toolkit";
import type { UserT } from "../types/appTypes";

type UserStateT = {
  value: UserT | null;
}

const initialState: UserStateT = { value: null };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
