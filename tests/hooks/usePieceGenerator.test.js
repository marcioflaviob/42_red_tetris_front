import { renderHook, act } from '@testing-library/react';
import usePieceGenerator from '../../src/hooks/usePieceGenerator';
describe('usePieceGenerator', () => {
  it('initializes', () => {
    const { result } = renderHook(() => usePieceGenerator(true, 'test-seed'));
    expect(result.current.nextPieces).toHaveLength(6);
    expect(typeof result.current.getNextPiece).toBe('function');
  });
  it('generates pieces deterministically', () => {
    const { result } = renderHook(() => usePieceGenerator(true, 'test-seed'));
    let piece;
    act(() => { piece = result.current.getNextPiece(); });
    expect(piece).toBeDefined();
    expect(result.current.nextPieces).toHaveLength(11);
  });
});