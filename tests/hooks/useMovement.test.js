import { renderHook, act } from '@testing-library/react';
import useMovement from '../../src/hooks/useMovement';
import { MOVES, COLLISION } from '../../src/utils/constants';
import { Tetromino } from '../../src/utils/tetromino';

describe('useMovement', () => {
  const setActivePiece = jest.fn();
  const rotatePiece = jest.fn();
  const activePiece = new Tetromino({ type: 'I' });
  const activePieceRef = { current: activePiece };
  const boardRef = { current: new Array(220).fill(0) };

  it('moves piece DOWN', () => {
    const { result } = renderHook(() => useMovement({ boardRef, activePieceRef, setActivePiece, rotatePiece }));
    act(() => {
      const res = result.current.movePiece(MOVES.DOWN);
      expect(res).toBe(COLLISION.NO);
    });
    expect(setActivePiece).toHaveBeenCalled();
  });

  it('moves piece LEFT', () => {
    const { result } = renderHook(() => useMovement({ boardRef, activePieceRef, setActivePiece, rotatePiece }));
    act(() => {
      const res = result.current.movePiece(MOVES.LEFT);
      expect(res).toBe(COLLISION.NO);
    });
    expect(setActivePiece).toHaveBeenCalled();
  });

  it('handles ROTATE', () => {
    rotatePiece.mockReturnValue({ shape: [], coords: [], pivot: [0,0], rotation: 1 });
    const { result } = renderHook(() => useMovement({ boardRef, activePieceRef, setActivePiece, rotatePiece }));
    act(() => {
      const res = result.current.movePiece(MOVES.ROTATE);
      expect(res).toBe(COLLISION.NO);
    });
    expect(setActivePiece).toHaveBeenCalled();
  });

  it('returns COLLISION.CONTINUE if rotation fails', () => {
    rotatePiece.mockReturnValue(null);
    const { result } = renderHook(() => useMovement({ boardRef, activePieceRef, setActivePiece, rotatePiece }));
    act(() => {
      const res = result.current.movePiece(MOVES.ROTATE);
      expect(res).toBe(COLLISION.CONTINUE);
    });
  });
});