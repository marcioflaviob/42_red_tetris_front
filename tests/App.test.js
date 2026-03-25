import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from '../src/App';
import userReducer from '../src/store/slices/userSlice';

// Mock sub-pages as simple IDs to verify routing
jest.mock('../src/base/HomePage', () => () => <div data-testid="home-page" />);
jest.mock('../src/pages/OfflineMatchRoom', () => () => <div data-testid="offline-room" />);
jest.mock('../src/pages/ErrorPage', () => () => <div data-testid="error-page" />);
jest.mock('../src/KeyedMatchRoom', () => ({ KeyedMatchRoom: () => <div data-testid="keyed-room" /> }));

// Ensure ProtectedRoutes doesn't block the test
jest.mock('../src/ProtectedRoutes', () => {
    const { Outlet } = require('react-router-dom');
    return () => <Outlet />;
});

const renderApp = (path) => {
    const store = configureStore({
        reducer: { user: userReducer },
        preloadedState: { user: { username: 'Test', sessionId: '123' } }
    });
    return render(
        <Provider store={store}>
            <MemoryRouter initialEntries={[path]}>
                <App />
            </MemoryRouter>
        </Provider>
    );
};

describe('App Routing', () => {
    test('routes to HomePage', () => {
        renderApp('/');
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    test('routes to OfflineRoom', () => {
        renderApp('/offline');
        expect(screen.getByTestId('offline-room')).toBeInTheDocument();
    });

    test('routes to KeyedRoom via roomId', () => {
        renderApp('/my-room-id');
        expect(screen.getByTestId('keyed-room')).toBeInTheDocument();
    });

    test('routes to ErrorPage on invalid nested path', () => {
        renderApp('/invalid/path/here');
        expect(screen.getByTestId('error-page')).toBeInTheDocument();
    });
});