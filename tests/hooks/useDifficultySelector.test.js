import { renderHook, act } from '@testing-library/react';
import useDifficultySelector from '../../src/hooks/useDifficultySelector';

describe('useDifficultySelector', () => {
    test('should initialize with Normal difficulty', () => {
        const { result } = renderHook(() => useDifficultySelector());

        expect(result.current.invisiblePieces).toBe(false);
        expect(result.current.increasedGravity).toBe(false);
        expect(result.current.piecePrediction).toBe(true);
        expect(result.current.difficulty).toEqual({
            level: 'Normal',
            progress: 33,
            color: 'normal',
        });
    });

    test('should return Medium difficulty when one "hard" option is active', () => {
        const { result } = renderHook(() => useDifficultySelector());

        // Case 1: Invisible pieces enabled
        act(() => {
            result.current.setInvisiblePieces(true);
        });
        expect(result.current.difficulty.level).toBe('Medium');

        // Case 2: Increased gravity enabled (with invisible pieces reset)
        act(() => {
            result.current.setInvisiblePieces(false);
            result.current.setIncreasedGravity(true);
        });
        expect(result.current.difficulty.level).toBe('Medium');

        // Case 3: Piece Prediction disabled (with gravity reset)
        act(() => {
            result.current.setIncreasedGravity(false);
            result.current.setPiecePrediction(false);
        });
        expect(result.current.difficulty.level).toBe('Medium');
    });

    test('should return Hard difficulty when two options are active', () => {
        const { result } = renderHook(() => useDifficultySelector());

        act(() => {
            result.current.setInvisiblePieces(true);
            result.current.setIncreasedGravity(true);
        });

        expect(result.current.difficulty).toEqual({
            level: 'Hard',
            progress: 100,
            color: 'hard',
        });
    });

    test('should return Hard difficulty when all three options are active', () => {
        const { result } = renderHook(() => useDifficultySelector());

        act(() => {
            result.current.setInvisiblePieces(true);
            result.current.setIncreasedGravity(true);
            result.current.setPiecePrediction(false);
        });

        expect(result.current.difficulty.level).toBe('Hard');
    });

    test('should return Normal (default) for fallback logic', () => {
        const { result } = renderHook(() => useDifficultySelector());

        // Toggle something on then off to ensure it goes back to default case
        act(() => {
            result.current.setInvisiblePieces(true);
            result.current.setInvisiblePieces(false);
        });

        expect(result.current.difficulty.level).toBe('Normal');
    });
});