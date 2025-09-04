
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AppTabsStateT {
  activeTab: string;
}

const initialState: AppTabsStateT = { activeTab: "Chats" };

const appTabsSlice = createSlice({
  name: "appTabs",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload
    },
  },
});

export const { setActiveTab  } =
  appTabsSlice.actions;

export default appTabsSlice.reducer;
