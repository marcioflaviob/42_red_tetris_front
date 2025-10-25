import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createUserService } from '../../services/UserService';

const service = createUserService();

export const fetchMatches = createAsyncThunk('user/fetchMatches', async () => {
  const matches = await service.getMatches();
  return matches;
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: service.getUsername(),
    avatar: service.getAvatar(),
    matches: [],
    matchesLoading: false,
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
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.matchesLoading = true;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.matches = action.payload;
        state.matchesLoading = false;
      })
      .addCase(fetchMatches.rejected, (state) => {
        state.matchesLoading = false;
      });
  },
});

export const { setUsername, setAvatar } = userSlice.actions;
export const selectUsername = (state) => state.user.username;
export const selectAvatar = (state) => state.user.avatar;
export const selectMatches = (state) => state.user.matches;
export default userSlice.reducer;
