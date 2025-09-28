import { createSlice } from '@reduxjs/toolkit';
import { createUserService } from '../../services/UserService';

const service = createUserService();

const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: service.getUsername(),
    avatar: service.getAvatar(),
    matches: service.getMatches()
  },
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
      service.saveUsername(action.payload);
    },
    setAvatar: (state, action) => {
      state.avatar = action.payload;
      service.saveAvatar(action.payload);
    }
  },
});

export const { setUsername, setAvatar } = userSlice.actions;
export const selectUsername = (state) => state.user.username;
export const selectAvatar = (state) => state.user.avatar;
export default userSlice.reducer;