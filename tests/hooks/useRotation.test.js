import { renderHook } from '@testing-library/react';
import useRotation from '../../src/hooks/useRotation';
import { COLLISION } from '../../src/utils/constants';
describe('useRotation', () => {
  const mockHasCollided = jest.fn();
  const mockBoardRef = { current: new Array(220).fill(0) };
  it('returns a function', () => {
    const { result } = renderHook(() => useRotation({ hasCollided: mockHasCollided, boardRef: mockBoardRef }));
    expect(typeof result.current).toBe('function');
  });
  it('rotates a square piece (O) without changing shape', () => {
    const rotate = renderHook(() => useRotation({ hasCollided: mockHasCollided, boardRef: mockBoardRef })).result.current;
    const piece = {
      shape: [[1, 1], [1, 1]],
      coords: [[0, 0], [0, 1], [1, 0], [1, 1]],
      pivot: [0.5, 0.5],
      rotation: 0
    };
    const rotated = rotate(piece);
    expect(rotated.shape).toEqual(piece.shape);
    expect(rotated.rotation).toBe(0);
  });
  it('rotates a J piece with SRS kicks', () => {
    mockHasCollided.mockReturnValue(COLLISION.NO);
    const rotate = renderHook(() => useRotation({ hasCollided: mockHasCollided, boardRef: mockBoardRef })).result.current;
    const piece = {
      shape: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
      coords: [[0, 0], [1, 0], [1, 1], [1, 2]],
      pivot: [1, 1],
      rotation: 0
    };
    const rotated = rotate(piece);
    expect(rotated).not.toBeNull();
    expect(rotated.rotation).toBe(1);
  });
  it('returns null if all kicks fail', () => {
    mockHasCollided.mockReturnValue(COLLISION.WALL);
    const rotate = renderHook(() => useRotation({ hasCollided: mockHasCollided, boardRef: mockBoardRef })).result.current;
    const piece = {
      shape: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
      coords: [[0, 0], [1, 0], [1, 1], [1, 2]],
      pivot: [1, 1],
      rotation: 0
    };
    const rotated = rotate(piece);
    expect(rotated).toBeNull();
  });
});