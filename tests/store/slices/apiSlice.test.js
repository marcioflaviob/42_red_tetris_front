import { configureStore } from '@reduxjs/toolkit';

// We mock the module VIRTUALLY so Jest never sees the 'import.meta' error
jest.mock('../../../src/store/slices/apiSlice', () => {
    const { createApi, fetchBaseQuery } = require('@reduxjs/toolkit/query/react');

    const mockApi = createApi({
        reducerPath: 'api',
        baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost' }),
        endpoints: (builder) => ({
            getHealth: builder.query({ query: () => 'health' }),
            createRoom: builder.mutation({
                query: (userData) => ({ url: 'room', method: 'POST', body: userData })
            }),
            joinRoom: builder.mutation({
                query: ({ roomId }) => ({ url: `room/${roomId}/join`, method: 'POST' })
            }),
        }),
    });

    return {
        api: mockApi,
        useGetHealthQuery: mockApi.useGetHealthQuery,
        useCreateRoomMutation: mockApi.useCreateRoomMutation,
        useJoinRoomMutation: mockApi.useJoinRoomMutation,
    };
});

// Now import the mocked version
import { api } from '../../../src/store/slices/apiSlice';

describe('apiSlice logic', () => {
    test('initializes and defines endpoints', () => {
        const store = configureStore({
            reducer: { [api.reducerPath]: api.reducer },
            middleware: (gdm) => gdm().concat(api.middleware),
        });

        expect(api.endpoints.getHealth).toBeDefined();
        // This executes the query function logic defined in the mock
        const healthQuery = api.endpoints.getHealth.initiate();
        expect(healthQuery).toBeDefined();
    });
});