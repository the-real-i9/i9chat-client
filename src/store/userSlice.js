import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    info: {
      id: 1,
      username: 'i9ine',
      profilePicture: 'https://i9ine.com/avatar.png',
    }
  },
  reducers: {
    setUser: (state, action) => {
      state.info = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
