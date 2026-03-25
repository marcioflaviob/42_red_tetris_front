import { renderHook, act } from '@testing-library/react';
import useTetrisGame from '../../src/hooks/useTetrisGame';
import * as useBoard from '../../src/hooks/useBoard';
import * as usePieceGenerator from '../../src/hooks/usePieceGenerator';
import * as useGameLoop from '../../src/hooks/useGameLoop';

jest.mock('../../src/hooks/useBoard');
jest.mock('../../src/hooks/usePieceGenerator');
jest.mock('../../src/hooks/useGameLoop');
jest.mock('../../src/hooks/useRotation', () => jest.fn(() => jest.fn()));
jest.mock('../../src/hooks/useMovement', () => jest.fn(() => ({ movePiece: jest.fn() })));

describe('useTetrisGame Hook', () => {
  const mockEmit = jest.fn();
  const mockPlayer = { sessionId: '123456789' };

  let mockSetBoard, mockSetActivePiece, mockSetSavedPiece;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockSetBoard = jest.fn();
    mockSetActivePiece = jest.fn();
    mockSetSavedPiece = jest.fn();

    useBoard.default.mockReturnValue({
      board: new Array(200).fill(null),
      boardRef: { current: new Array(200).fill(null) },
      setBoard: mockSetBoard,
      activePiece: null,
      activePieceRef: { current: null },
      setActivePiece: mockSetActivePiece,
      savedPiece: { tetromino: null, disabled: false },
      setSavedPiece: mockSetSavedPiece,
    });

    usePieceGenerator.default.mockReturnValue({
      nextPieces: [],
      getNextPiece: jest.fn(() => ({ shape: [[1]], color: 'red', getPredictCoords: () => [[0, 0]] })),
    });

    useGameLoop.default.mockReturnValue(Date.now());
  });

  it('handles spawnTetromino', () => {
    const { result } = renderHook(() => useTetrisGame({
      player: mockPlayer,
      startGame: true,
      emit: mockEmit,
    }));

    const mockPiece = { shape: [[1]], color: 'red' };
    act(() => {
      result.current.spawnTetromino(mockPiece);
    });

    expect(mockSetActivePiece).toHaveBeenCalledWith(mockPiece);
  });

  it('handles addGarbage', () => {
    const { result } = renderHook(() => useTetrisGame({
      player: mockPlayer,
      startGame: true,
      emit: mockEmit,
    }));

    act(() => {
      result.current.addGarbage(2);
    });

    expect(result.current.pendingGarbage).toBe(2);
  });

  it('returns memoized full game state', () => {
    const { result } = renderHook(() => useTetrisGame({
      player: mockPlayer,
      startGame: true,
      emit: mockEmit,
    }));

    const state = result.current.getFullGameState();
    expect(state).toHaveProperty('board');
    expect(state).toHaveProperty('activePiece');
    expect(state).toHaveProperty('nextPieces');
    expect(state).toHaveProperty('gameOver', false);
  });
});