import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    info: null
  },
  reducers: {
    setUser: (state, action) => {
      state.info = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
