import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createUserService } from '../../services/UserService';

const service = createUserService();

export const loadMatchesFromStorage = createAsyncThunk(
  'user/loadMatchesFromStorage',
  async () => {
    const matches = await service.getMatches();
    return matches;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: service.getUsername(),
    avatar: service.getAvatar(),
    matches: [],
    sessionId: service.getSessionId(),
  },
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
      service.saveUsername(action.payload);
    },
    setAvatar: (state, action) => {
      state.avatar = action.payload;
      service.saveAvatar(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadMatchesFromStorage.fulfilled, (state, action) => {
      state.matches = action.payload;
    });
  },
});

export const { setUsername, setAvatar } = userSlice.actions;
export const selectUsername = (state) => state.user.username;
export const selectAvatar = (state) => state.user.avatar;
export const selectUser = (state) => ({
  username: state.user.username,
  avatar: state.user.avatar,
  sessionId: state.user.sessionId,
});
export default userSlice.reducer;
