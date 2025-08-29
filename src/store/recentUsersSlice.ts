import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserT } from "../types/appTypes";

interface RecentUsersStateT {
  value: UserT[];
}

const initialState: RecentUsersStateT = { value: [] };

const recentUsersSlice = createSlice({
  name: "recentUsers",
  initialState,
  reducers: {
    addRecentUser: (state, action: PayloadAction<UserT>) => {
      state.value.unshift(action.payload); // add to top
    },
    removeRecentUser: (state, action: PayloadAction<string>) => {
      state.value = state.value.filter((u) => u.username !== action.payload);
    },
    clearRecentUsers: (state) => {
      state.value = [];
    },
  },
});

export const { addRecentUser, removeRecentUser, clearRecentUsers } =
  recentUsersSlice.actions;

export default recentUsersSlice.reducer;
