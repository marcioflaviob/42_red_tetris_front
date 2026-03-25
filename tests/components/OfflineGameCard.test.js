import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import GameCard from '../../src/components/cards/OfflineGameCard';
import userReducer from '../../src/store/slices/userSlice';
import matchReducer from '../../src/store/slices/matchSlice';

const player = { username: 'TestUser', avatar: 'avatar1.png' };

// Mock hooks
jest.mock('../../src/hooks/useTetrisGame', () => ({
  __esModule: true,
  default: () => ({
    board: new Array(200).fill(null),
    activePiece: null,
    activePieceRef: { current: null },
    ghostPiece: null,
    nextPieces: ['I', 'J', 'L'],
    savedPiece: 'T',
    isPaused: false,
    isGameOver: false,
    isWinner: false,
    score: 100,
    rowsCleared: 2,
    level: 1,
    combo: 0,
    garbageLines: 0,
    spawnTetromino: jest.fn(),
  }),
}));

jest.mock('../../src/hooks/useScoreManager', () => ({
  __esModule: true,
  default: () => ({}),
}));

jest.mock('../../src/hooks/useKeyboard', () => ({
  __esModule: true,
  default: () => ({}),
}));

const renderWithProviders = (ui) => {
  const store = configureStore({
    reducer: {
       user: userReducer,
       match: matchReducer
    },
    preloadedState: {
        user: {
            username: 'TestUser',
            avatar: 'avatar1.png',
            matches: [],
            sessionId: 'test-session'
        }
    }
  });
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('OfflineGameCard Component', () => {
  const defaultProps = {
    player: player,
    setScore: jest.fn(),
    setRowsCleared: jest.fn(),
    setLevel: jest.fn(),
    setCombo: jest.fn(),
    setNextPieces: jest.fn(),
    setSavedPiece: jest.fn(),
    setIsGameOver: jest.fn(),
    setIsWinner: jest.fn(),
    setGarbageLines: jest.fn(),
    onGameOver: jest.fn(),
    isOnline: false,
  };

  it('renders player username', () => {
    renderWithProviders(<GameCard {...defaultProps} />);
    expect(screen.getByText(/TestUser/i)).toBeInTheDocument();
  });

  it('renders the game board', () => {
    const { container } = renderWithProviders(<GameCard {...defaultProps} />);
    const cells = container.querySelectorAll('.cell, .bufferZoneCell');
    expect(cells.length).toBe(200);
  });

  it('renders the Next pieces section', () => {
    renderWithProviders(<GameCard {...defaultProps} />);
    expect(screen.getByText(/Next/i)).toBeInTheDocument();
  });

  it('renders the Hold piece section', () => {
    renderWithProviders(<GameCard {...defaultProps} />);
    expect(screen.getByText(/Hold/i)).toBeInTheDocument();
  });
});