import { renderHook, act } from '@testing-library/react';
import useBoard from '../../src/hooks/useBoard';
describe('useBoard', () => {
  it('initializes', () => {
    const { result } = renderHook(() => useBoard());
    expect(result.current.board.length).toBe(220);
  });
  it('updates board', () => {
    const { result } = renderHook(() => useBoard());
    act(() => result.current.setBoard(new Array(220).fill(1)));
    expect(result.current.board[0]).toBe(1);
    act(() => result.current.setBoard(b => { const nb = [...b]; nb[1] = 2; return nb; }));
    expect(result.current.board[1]).toBe(2);
  });
  it('updates pieces', () => {
    const { result } = renderHook(() => useBoard());
    act(() => result.current.setActivePiece({ type: 'I' }));
    expect(result.current.activePiece.type).toBe('I');
    act(() => result.current.setActivePiece(p => ({ ...p, type: 'O' })));
    expect(result.current.activePiece.type).toBe('O');
    act(() => result.current.setSavedPiece({ tetromino: 'T' }));
    expect(result.current.savedPiece.tetromino).toBe('T');
    act(() => result.current.setSavedPiece(s => ({ ...s, tetromino: 'S' })));
    expect(result.current.savedPiece.tetromino).toBe('S');
  });
});