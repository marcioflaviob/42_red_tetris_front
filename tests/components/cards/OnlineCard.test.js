import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import OnlineCard from '../../../src/components/cards/OnlineCard';
import userReducer from '../../../src/store/slices/userSlice';

// 1. Setup specific mocks for setters
const mockSetPiecePrediction = jest.fn();
const mockSetInvisiblePieces = jest.fn();
const mockSetIncreasedGravity = jest.fn();
const mockNavigate = jest.fn();
const mockCreateRoom = jest.fn().mockReturnValue({
    unwrap: () => Promise.resolve({ id: 'room-123', players: [{ username: 'TestPlayer' }] })
});

// 2. Mock hooks and slices
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../src/store/slices/apiSlice', () => ({
    useCreateRoomMutation: () => [mockCreateRoom, { isLoading: false }],
    useGetHealthQuery: () => ({ data: {}, isLoading: false })
}));

jest.mock('../../../src/hooks/useDifficultySelector', () => () => ({
    difficulty: { color: 'easy', level: 'Easy', progress: 33 },
    invisiblePieces: false,
    setInvisiblePieces: mockSetInvisiblePieces,
    increasedGravity: false,
    setIncreasedGravity: mockSetIncreasedGravity,
    piecePrediction: false,
    setPiecePrediction: mockSetPiecePrediction,
}));

// 3. FIX: Mock the InputSwitch using the correct path from the perspective of the TEST file
jest.mock('../../../src/components/ui/Inputs/InputSwitch', () => ({ checked, onChange }) => (
    <input
        type="checkbox"
        data-testid="mock-switch"
        checked={checked}
        onChange={onChange}
    />
));

const renderOnlineCard = () => {
    const store = configureStore({
        reducer: { user: userReducer },
        preloadedState: { user: { username: 'TestPlayer' } }
    });
    return render(
        <Provider store={store}>
            <BrowserRouter>
                <OnlineCard />
            </BrowserRouter>
        </Provider>
    );
};

describe('OnlineCard Component', () => {
    test('triggers setting toggles correctly', () => {
        renderOnlineCard();

        const switches = screen.getAllByTestId('mock-switch');

        // Simulate change event which is what InputSwitch triggers
        fireEvent.click(switches[0]);
        expect(mockSetPiecePrediction).toHaveBeenCalled();

        fireEvent.click(switches[1]);
        expect(mockSetInvisiblePieces).toHaveBeenCalled();

        fireEvent.click(switches[2]);
        expect(mockSetIncreasedGravity).toHaveBeenCalled();
    });

    test('handles room creation', async () => {
        renderOnlineCard();
        fireEvent.click(screen.getByText(/Create room/i));
        await waitFor(() => {
            expect(mockCreateRoom).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalled();
        });
    });

    test('validates room ID and joins', () => {
        renderOnlineCard();
        const input = screen.getByPlaceholderText(/Type the room ID/i);
        fireEvent.change(input, { target: { value: 'cool-room' } });
        fireEvent.click(screen.getByRole('button', { name: /Join Room/i }));
        expect(mockNavigate).toHaveBeenCalledWith('/cool-room');
    });
});