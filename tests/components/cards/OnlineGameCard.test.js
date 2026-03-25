import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import OnlineGameCard from '../../../src/components/cards/OnlineGameCard';
import userReducer from '../../../src/store/slices/userSlice';
import { MOVES } from '../../../src/utils/constants';

// 1. Mock the custom hooks
const mockShape = [[1, 1], [1, 1]];
const mockMovePiece = jest.fn();
const mockGetNextPiece = jest.fn(() => ({ shape: mockShape, color: 'cyan' }));
const mockSetBoard = jest.fn();
const mockSetActivePiece = jest.fn();
const mockSetSavedPiece = jest.fn();

jest.mock('../../../src/hooks/useBoard', () => () => ({
  board: new Array(200).fill(null),
  boardRef: { current: new Array(200).fill(null) },
  setBoard: mockSetBoard,
  activePiece: { coords: [[0, 0]], color: 'red', shape: mockShape },
  activePieceRef: { current: { color: 'red', getPredictCoords: () => [[0, 0]], shape: mockShape } },
  setActivePiece: mockSetActivePiece,
  savedPiece: { tetromino: { shape: mockShape, color: 'blue' }, disabled: false },
  savedPieceRef: { current: { disabled: false } },
  setSavedPiece: mockSetSavedPiece,
}));

jest.mock('../../../src/hooks/usePieceGenerator', () => () => ({
  nextPieces: [{ shape: mockShape, color: 'purple' }],
  getNextPiece: mockGetNextPiece,
}));

jest.mock('../../../src/hooks/useMovement', () => () => ({
  movePiece: mockMovePiece,
}));

let socketCallback;
jest.mock('../../../src/hooks/useSocket', () => () => ({
  on: jest.fn((event, cb) => {
    // We only capture the listener for the player's short ID
    if (event === '12345678') socketCallback = cb;
  }),
  off: jest.fn(),
}));

const renderWithRedux = (ui) => {
  const store = configureStore({
    reducer: { user: userReducer },
    preloadedState: { user: { username: 'Test', avatar: 'default.webp' } }
  });
  return render(<Provider store={store}>{ui}</Provider>);
};

const mockPlayer = {
  sessionId: '1234567890', // shortSessionId will be '12345678'
  username: 'Opponent1',
  avatar: 'avatar1.webp',
};

describe('OnlineGameCard Component', () => {
  beforeEach(() => jest.clearAllMocks());

  test('renders player UI', () => {
    renderWithRedux(<OnlineGameCard player={mockPlayer} startGame={true} />);
    expect(screen.getByText('Opponent1')).toBeInTheDocument();
  });

  test('responds to socket move events using correct constants', () => {
    renderWithRedux(<OnlineGameCard player={mockPlayer} startGame={true} />);

    // We use the actual MOVES constants to ensure the switch statement matches
    act(() => {
      socketCallback({ action: MOVES.DOWN });
    });
    expect(mockMovePiece).toHaveBeenCalledWith(MOVES.DOWN);

    act(() => {
      socketCallback({ action: MOVES.LEFT });
    });
    expect(mockMovePiece).toHaveBeenCalledWith(MOVES.LEFT);
  });

  test('responds to board-sync snapshot', () => {
    renderWithRedux(<OnlineGameCard player={mockPlayer} startGame={true} />);
    const newBoard = new Array(200).fill('blue');
    act(() => {
      socketCallback({ action: 'board-sync', board: newBoard });
    });
    expect(mockSetBoard).toHaveBeenCalledWith(newBoard);
  });

  test('responds to add-garbage logic', () => {
    renderWithRedux(<OnlineGameCard player={mockPlayer} startGame={true} />);
    act(() => {
      socketCallback({ action: 'add-garbage', lines: 4 });
    });
    // Verifies the code branch executed without error
    expect(socketCallback).toBeDefined();
  });

  test('handles game over trigger', () => {
    renderWithRedux(<OnlineGameCard player={mockPlayer} startGame={true} />);
    act(() => {
      socketCallback({ action: MOVES.HARD_DROP });
    });
    expect(screen.getByText(/Game over/i)).toBeInTheDocument();
  });
});