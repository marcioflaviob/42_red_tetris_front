import { renderHook, act } from '@testing-library/react';
import useGameLoop from '../../src/hooks/useGameLoop';

describe('useGameLoop', () => {
  const mockCallback = jest.fn();
  const mockMovePiece = jest.fn();
  const mockLockPiece = jest.fn();
  const mockUpdateSavedPiece = jest.fn();
  const mockEmit = jest.fn();
  
  const defaultProps = {
    callback: mockCallback,
    player: { sessionId: '12345678' },
    movePiece: mockMovePiece,
    lockPiece: mockLockPiece,
    updateSavedPiece: mockUpdateSavedPiece,
    startGame: true,
    gameOver: false,
    level: 1,
    increasedGravity: false,
    emit: mockEmit,
  };

  it('initializes and returns null for lastDrop initially', () => {
    const { result } = renderHook(() => useGameLoop(
      defaultProps.callback,
      defaultProps.player,
      defaultProps.movePiece,
      defaultProps.lockPiece,
      defaultProps.updateSavedPiece,
      defaultProps.startGame,
      defaultProps.gameOver,
      defaultProps.level,
      defaultProps.increasedGravity,
      defaultProps.emit
    ));
    expect(result.current).toBeNull();
  });

  it('triggers gravity tick after delay', () => {
    jest.useFakeTimers();
    // Mock Date.now to control gravity check
    let currentTime = 1000;
    jest.spyOn(Date, 'now').mockImplementation(() => currentTime);

    renderHook(() => useGameLoop(
      defaultProps.callback,
      defaultProps.player,
      defaultProps.movePiece,
      defaultProps.lockPiece,
      defaultProps.updateSavedPiece,
      defaultProps.startGame,
      defaultProps.gameOver,
      defaultProps.level,
      defaultProps.increasedGravity,
      defaultProps.emit
    ));

    act(() => {
      currentTime += 2000; // Increment time past gravity delay (default 1000ms)
      jest.advanceTimersByTime(100); // Trigger interval loop
    });

    expect(mockMovePiece).toHaveBeenCalled();
    
    jest.restoreAllMocks();
    jest.useRealTimers();
  });
});