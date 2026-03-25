import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OfflineCard from '../../../src/components/cards/OfflineCard';

// 1. Setup specific mocks for setters
const mockSetPiecePrediction = jest.fn();
const mockSetInvisiblePieces = jest.fn();
const mockSetIncreasedGravity = jest.fn();
const mockNavigate = jest.fn();

// 2. Mock hooks
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
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

// 3. Mock InputSwitch to be a simple checkbox for reliability
jest.mock('../../../src/components/ui/Inputs/InputSwitch', () => ({ checked, onChange }) => (
    <input
        type="checkbox"
        data-testid="mock-switch"
        checked={checked}
        onChange={onChange}
    />
));

describe('OfflineCard Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders titles and difficulty info', () => {
        render(
            <BrowserRouter>
                <OfflineCard />
            </BrowserRouter>
        );

        expect(screen.getByText(/Solo Play/i)).toBeInTheDocument();
        expect(screen.getByText(/Difficulty Level/i)).toBeInTheDocument();
        expect(screen.getByText(/Easy/i)).toBeInTheDocument();
    });

    test('triggers difficulty setters when switches are toggled', () => {
        render(
            <BrowserRouter>
                <OfflineCard />
            </BrowserRouter>
        );

        const switches = screen.getAllByTestId('mock-switch');

        // Toggle Shadow Piece
        fireEvent.click(switches[0]);
        expect(mockSetPiecePrediction).toHaveBeenCalled();

        // Toggle Invisible Pieces
        fireEvent.click(switches[1]);
        expect(mockSetInvisiblePieces).toHaveBeenCalled();

        // Toggle Gravity
        fireEvent.click(switches[2]);
        expect(mockSetIncreasedGravity).toHaveBeenCalled();
    });

    test('navigates to /offline with correct state when Start Game is clicked', () => {
        render(
            <BrowserRouter>
                <OfflineCard />
            </BrowserRouter>
        );

        const playBtn = screen.getByText(/Start Game/i);
        fireEvent.click(playBtn);

        expect(mockNavigate).toHaveBeenCalledWith('/offline', {
            state: {
                piecePrediction: false,
                invisiblePieces: false,
                increasedGravity: false,
            },
        });
    });
});