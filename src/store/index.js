import { configureStore } from '@reduxjs/toolkit';
import userReducer, { loadMatchesFromStorage } from './slices/userSlice';
import matchReducer from './slices/matchSlice'
import { api } from './slices/apiSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    match: matchReducer,
    [api.reducerPath]: api.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

store.dispatch(loadMatchesFromStorage());
