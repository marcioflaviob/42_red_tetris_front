import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit';
import { createUserService } from '../../services/UserService';

const service = createUserService();

/**
 * Thunk to load matches from storage.
 * Coverage: Hits the extraReducers builder case.
 */
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

/**
 * SELECTORS
 */

// Simple selectors for primitive values (strings) are fine as-is.
export const selectUsername = (state) => state.user.username;
export const selectAvatar = (state) => state.user.avatar;

// Input selector for the memoized version
const selectUserBase = (state) => state.user;

/**
 * Memoized Selector
 * FIX: This prevents the "Selector returned a different result" warning
 * because it only returns a new object reference if the underlying data changes.
 */
export const selectUser = createSelector(
  [selectUserBase],
  (user) => ({
    username: user.username,
    avatar: user.avatar,
    sessionId: user.sessionId,
  })
);

export default userSlice.reducer;