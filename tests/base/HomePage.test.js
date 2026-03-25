import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import HomePage from '../../src/base/HomePage';
import userReducer from '../../src/store/slices/userSlice';

// 1. Mock problematic imports entirely
jest.mock('../../src/store/slices/apiSlice', () => ({
    useGetHealthQuery: jest.fn(() => ({ data: null, error: null, isLoading: false })),
}));

jest.mock('../../src/components/ui/Backgrounds/HomePageBg', () => () => <div data-testid="bg" />);
jest.mock('../../src/components/cards/UserCard', () => () => <div>User Card</div>);
jest.mock('../../src/components/cards/OfflineCard', () => () => <div>Offline Card</div>);
jest.mock('../../src/components/cards/OnlineCard', () => () => <div>Online Card</div>);
jest.mock('../../src/components/cards/MatchHistory', () => () => <div>Match History</div>);

const renderHomePage = (username = null) => {
    const store = configureStore({
        reducer: { user: userReducer },
        preloadedState: {
            user: { username, sessionId: username ? '123' : null, avatar: 'default.webp' }
        }
    });

    return render(
        <Provider store={store}>
            <HomePage />
        </Provider>
    );
};

describe('HomePage Component', () => {
    test('renders welcome overlay when user has no username', () => {
        renderHomePage(null);

        expect(screen.getByText(/RED/)).toBeInTheDocument();
        expect(screen.getByText(/TETRIS/)).toBeInTheDocument();
        expect(screen.getByText(/Drop · Clear · Dominate/i)).toBeInTheDocument();
        expect(screen.getByText(/Get started/i)).toBeInTheDocument();
    });

    test('hides welcome overlay when user has a username', () => {
        renderHomePage('Teo');

        // The specific "RED" span should not be there
        expect(screen.queryByText(/RED/)).not.toBeInTheDocument();

        // Core dashboard components should still render
        expect(screen.getByText(/User Card/i)).toBeInTheDocument();
        expect(screen.getByText(/Match History/i)).toBeInTheDocument();
        expect(screen.getByText(/Offline Card/i)).toBeInTheDocument();
        expect(screen.getByText(/Online Card/i)).toBeInTheDocument();
    });

    test('renders the grid layout correctly', () => {
        renderHomePage('Teo');
        // Check for the dashboard components container
        expect(screen.getByText(/User Card/i)).toBeInTheDocument();
        expect(screen.getByText(/Match History/i)).toBeInTheDocument();
    });
});