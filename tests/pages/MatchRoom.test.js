import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import MatchRoom from '../../src/pages/MatchRoom';
import userReducer from '../../src/store/slices/userSlice';

// 1. MOCK SOCKET SERVICE (Self-contained to avoid hoisting errors)
jest.mock('../../src/services/SocketService', () => ({
    socketService: {
        connect: jest.fn().mockReturnValue({
            on: jest.fn(),
            off: jest.fn(),
            emit: jest.fn(),
            disconnect: jest.fn(),
        }),
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
        disconnect: jest.fn(),
    },
}));

// 2. MOCK API SLICE (Bypasses the import.meta.env crash)
jest.mock('../../src/store/slices/apiSlice', () => ({
    useJoinRoomMutation: () => [
        jest.fn().mockResolvedValue({ data: { players: [] } }),
        { data: null, isSuccess: false, isError: false }
    ],
}));

// 3. MOCK HOOKS & SUB-COMPONENTS
jest.mock('../../src/hooks/useSocket', () => ({
    __esModule: true,
    default: () => ({ emit: jest.fn(), on: jest.fn(), off: jest.fn(), isConnected: true }),
}));

jest.mock('../../src/hooks/useAudioManager', () => ({
    __esModule: true,
    default: () => ({ isPlaying: false, play: jest.fn(), pause: jest.fn(), startGameTransition: jest.fn() }),
}));

jest.mock('../../src/components/cards/OfflineGameCard', () => () => <div data-testid="game-card" />);
jest.mock('../../src/components/cards/OnlineGameCard', () => () => <div data-testid="online-card" />);
jest.mock('../../src/components/ui/Countdown/Countdown', () => () => <div data-testid="countdown" />);

const renderMatchRoom = () => {
    const store = configureStore({
        reducer: { user: userReducer },
        preloadedState: {
            user: { username: 'TestUser', sessionId: 'user-123', avatar: 'default.webp' }
        }
    });

    return render(
        <Provider store={store}>
            <MemoryRouter initialEntries={['/room/test-room']}>
                <Routes>
                    <Route path="/room/:roomId" element={<MatchRoom />} />
                </Routes>
            </MemoryRouter>
        </Provider>
    );
};

describe('MatchRoom Component', () => {
    test('renders without crashing', async () => {
        await act(async () => {
            renderMatchRoom();
        });
        expect(screen.getByTestId('game-card')).toBeInTheDocument();
    });
});