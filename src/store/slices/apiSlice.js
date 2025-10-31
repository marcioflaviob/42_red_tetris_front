import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    prepareHeaders: (headers, { getState }) => {
      const sessionId = getState().user.sessionId;
      headers.set('x-session-id', sessionId);
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createRoom: builder.mutation({
      query: (userData) => ({
        url: '/room',
        method: 'POST',
        body: userData,
      }),
    }),
    joinRoom: builder.mutation({
      query: ({ user, roomId }) => ({
        url: `/room/${roomId}/join`,
        method: 'POST',
        body: { user },
      }),
    }),
  }),
});

export const { useCreateRoomMutation, useJoinRoomMutation } = api;
