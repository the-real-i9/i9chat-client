import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { get, clear, update } from "idb-keyval";

import type { UserT } from "../types/appTypes";

type RecentUsersStateT = {
  value: UserT[];
}

const initialState: RecentUsersStateT = {
  value: (await get("recent_users")) || [],
};

const recentUsersSlice = createSlice({
  name: "recentUsers",
  initialState,
  reducers: {
    addRecentUser: (state, action: PayloadAction<UserT>) => {
      state.value.unshift(action.payload);

      update<UserT[]>("recent_users", (rus) => {
        if (!rus) {
          const rus = [];
          rus.push(action.payload);

          return rus;
        }

        rus.unshift(action.payload);

        return rus;
      });
    },
    removeRecentUser: (state, action: PayloadAction<string>) => {
      state.value = state.value.filter((u) => u.username !== action.payload);

      update<UserT[]>("recent_users", (rus) => {
        if (!rus) return [];

        rus.filter((u) => u.username !== action.payload);

        return rus;
      });
    },
    clearRecentUsers: (state) => {
      state.value = [];
      clear();
    },
  },
});

export const { addRecentUser, removeRecentUser, clearRecentUsers } =
  recentUsersSlice.actions;

export default recentUsersSlice.reducer;
