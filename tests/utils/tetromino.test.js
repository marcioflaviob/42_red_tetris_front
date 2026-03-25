import { PieceBag, Tetromino } from '../../src/utils/tetromino';
import { COLOR, SPAWN_CELL_COL, MOVES, COLLISION, SHAPES } from '../../src/utils/constants';
import { getRandom, hasCollided } from '../../src/utils/helper';

// --- Mocks ---
jest.mock('../../src/utils/constants', () => ({
    COLOR: { RED: 'red', BLUE: 'blue', GREEN: 'green' },
    SPAWN_CELL_COL: 3,
    MOVES: { DOWN: 'DOWN' },
    COLLISION: { LOCK: 'LOCK', CONTINUE: 'CONTINUE' },
    SHAPES: [
        [[1, 1], [1, 1]],       // O-shape (2x2)
        [[1, 1, 1, 1]],         // I-shape (1x4)
        [[0, 1, 0], [1, 1, 1]], // T-shape (2x3)
    ],
}));

jest.mock('../../src/utils/helper', () => ({
    getRandom: jest.fn(),
    hasCollided: jest.fn(),
}));

// ─────────────────────────────────────────────
// PieceBag
// ─────────────────────────────────────────────
describe('PieceBag', () => {
    let bag;

    beforeEach(() => {
        bag = new PieceBag();
    });

    describe('constructor', () => {
        it('initialises with an empty colorBag', () => {
            expect(bag.colorBag).toEqual([]);
        });
    });

    describe('reset()', () => {
        it('empties a non-empty colorBag', () => {
            bag.colorBag = ['red', 'blue'];
            bag.reset();
            expect(bag.colorBag).toEqual([]);
        });
    });

    describe('getState()', () => {
        it('returns a shallow copy of colorBag', () => {
            bag.colorBag = ['red', 'blue'];
            const state = bag.getState();
            expect(state).toEqual({ colorBag: ['red', 'blue'] });
            // Mutation of the copy must not affect the original
            state.colorBag.push('green');
            expect(bag.colorBag).toHaveLength(2);
        });
    });

    describe('setState()', () => {
        it('restores colorBag from state', () => {
            bag.setState({ colorBag: ['red', 'green'] });
            expect(bag.colorBag).toEqual(['red', 'green']);
        });

        it('sets colorBag to [] when state has no colorBag', () => {
            bag.colorBag = ['red'];
            bag.setState({});
            expect(bag.colorBag).toEqual([]);
        });

        it('stores a copy, not the original array reference', () => {
            const src = ['red'];
            bag.setState({ colorBag: src });
            src.push('blue');
            expect(bag.colorBag).toHaveLength(1);
        });
    });

    describe('getNextColor()', () => {
        it('fills and shuffles the bag when empty, then returns a colour', () => {
            // Deterministic rng: always picks index 0 (no real shuffle)
            const rng = jest.fn(() => 0);
            const color = bag.getNextColor(rng);
            expect(Object.values(COLOR)).toContain(color);
        });

        it('does NOT refill when the bag still has colours', () => {
            bag.colorBag = ['red', 'blue'];
            const rng = jest.fn(() => 0);
            const color = bag.getNextColor(rng);
            expect(color).toBe('blue'); // pop() takes the last element
            expect(bag.colorBag).toEqual(['red']);
            expect(rng).not.toHaveBeenCalled();
        });

        it('refills once the bag is exhausted', () => {
            const rng = jest.fn(() => 0);
            // Drain the bag
            const colors = Object.values(COLOR);
            colors.forEach(() => bag.getNextColor(rng));
            // Now it must refill on the next call
            const color = bag.getNextColor(rng);
            expect(Object.values(COLOR)).toContain(color);
        });

        it('returns every colour exactly once before refilling', () => {
            // Use a rng that produces 0 so the Fisher-Yates swap is always i↔0
            const rng = jest.fn(() => 0);
            const returned = new Set();
            const total = Object.values(COLOR).length;
            for (let i = 0; i < total; i++) {
                returned.add(bag.getNextColor(rng));
            }
            expect(returned.size).toBe(total);
        });
    });
});

// ─────────────────────────────────────────────
// Tetromino
// ─────────────────────────────────────────────

// Convenience shapes
const SHAPE_2x2 = [[1, 1], [1, 1]];        // O-piece
const SHAPE_1x4 = [[1, 1, 1, 1]];          // I-piece (horizontal)
const SHAPE_4x1 = [[1], [1], [1], [1]];    // I-piece (vertical)
const SHAPE_2x3 = [[0, 1, 0], [1, 1, 1]];  // T-piece

describe('Tetromino', () => {
    beforeEach(() => {
        getRandom.mockReset();
        hasCollided.mockReset();
    });

    // ── constructor ──────────────────────────────
    describe('constructor', () => {
        it('uses the provided shape, color, coords and pivot', () => {
            const coords = [[0, 3], [0, 4]];
            const pivot = [1, 1];
            const t = new Tetromino({
                shape: SHAPE_2x2,
                color: 'red',
                coords,
                pivot,
                rotation: 2,
            });
            expect(t.shape).toBe(SHAPE_2x2);
            expect(t.color).toBe('red');
            expect(t.coords).toBe(coords);
            expect(t.pivot).toBe(pivot);
            expect(t.rotation).toBe(2);
        });

        it('calls getRandom when shape is not provided', () => {
            getRandom.mockReturnValue(SHAPE_2x2);
            const rng = jest.fn();
            new Tetromino({ rng });
            expect(getRandom).toHaveBeenCalledWith(SHAPES, rng);
        });

        it('uses colorBag.getNextColor when no color is supplied', () => {
            const colorBag = { getNextColor: jest.fn(() => 'blue') };
            getRandom.mockReturnValue(SHAPE_2x2);
            const colorRng = jest.fn();
            const t = new Tetromino({ colorBag, colorRng });
            expect(colorBag.getNextColor).toHaveBeenCalledWith(colorRng);
            expect(t.color).toBe('blue');
        });

        it('sets color to null when neither color nor colorBag is provided', () => {
            getRandom.mockReturnValue(SHAPE_2x2);
            const t = new Tetromino({});
            expect(t.color).toBeNull();
        });

        it('defaults rotation to 0', () => {
            getRandom.mockReturnValue(SHAPE_2x2);
            const t = new Tetromino({});
            expect(t.rotation).toBe(0);
        });
    });

    // ── getInitialCoords ─────────────────────────
    describe('getInitialCoords()', () => {
        it('computes coords for a 2x2 shape offset by SPAWN_CELL_COL (3)', () => {
            const t = new Tetromino({ shape: SHAPE_2x2, color: 'red' });
            // All cells are 1, so we expect 4 coords
            expect(t.coords).toEqual([
                [0, 3], [0, 4],
                [1, 3], [1, 4],
            ]);
        });

        it('skips zero cells', () => {
            // SHAPE_2x3 = [[0,1,0],[1,1,1]] → 4 filled cells
            const t = new Tetromino({ shape: SHAPE_2x3, color: 'red' });
            expect(t.coords).toHaveLength(4);
            expect(t.coords).not.toContainEqual([0, 3]); // (0,0) cell is 0
        });

        it('handles a 1×4 horizontal I-piece', () => {
            const t = new Tetromino({ shape: SHAPE_1x4, color: 'red' });
            expect(t.coords).toEqual([[0, 3], [0, 4], [0, 5], [0, 6]]);
        });
    });

    // ── calculatePivot ───────────────────────────
    describe('calculatePivot()', () => {
        it('returns [0, 1] for a 1×4 horizontal shape', () => {
            const t = new Tetromino({ shape: SHAPE_1x4, color: 'red' });
            expect(t.pivot).toEqual([0, 1]);
        });

        it('returns [2, 0] for a 4×1 vertical shape', () => {
            const t = new Tetromino({ shape: SHAPE_4x1, color: 'red' });
            expect(t.pivot).toEqual([2, 0]);
        });

        it('returns centre cell for a 2×2 shape', () => {
            // centerRow = floor(2/2) = 1, centerCol = floor(2/2) = 1
            const t = new Tetromino({ shape: SHAPE_2x2, color: 'red' });
            expect(t.pivot).toEqual([1, 1]);
        });

        it('returns centre cell for a 2×3 shape', () => {
            // centerRow = floor(2/2) = 1, centerCol = floor(3/2) = 1
            const t = new Tetromino({ shape: SHAPE_2x3, color: 'red' });
            expect(t.pivot).toEqual([1, 1]);
        });
    });

    // ── getPredictCoords ─────────────────────────
    describe('getPredictCoords()', () => {
        const board = {};

        it('returns [] when coords is empty', () => {
            const t = new Tetromino({ shape: SHAPE_2x2, color: 'red', coords: [] });
            expect(t.getPredictCoords(board)).toEqual([]);
        });

        it('returns [] when coords is null', () => {
            const t = new Tetromino({ shape: SHAPE_2x2, color: 'red', coords: [] });
            t.coords = null;
            expect(t.getPredictCoords(board)).toEqual([]);
        });

        it('stops on COLLISION.LOCK and returns last valid prediction', () => {
            // First call → no collision (piece can move down once)
            // Second call → LOCK
            hasCollided
                .mockReturnValueOnce(null)       // first next: no collision
                .mockReturnValueOnce(COLLISION.LOCK); // second next: lock

            const t = new Tetromino({
                shape: SHAPE_2x2,
                color: 'red',
                coords: [[0, 3], [0, 4], [1, 3], [1, 4]],
            });

            const result = t.getPredictCoords(board);
            // After one successful drop the rows should be +1
            expect(result).toEqual([[1, 3], [1, 4], [2, 3], [2, 4]]);
        });

        it('stops on COLLISION.CONTINUE and returns last valid prediction', () => {
            hasCollided.mockReturnValueOnce(COLLISION.CONTINUE);

            const t = new Tetromino({
                shape: SHAPE_2x2,
                color: 'red',
                coords: [[0, 3], [0, 4], [1, 3], [1, 4]],
            });

            const result = t.getPredictCoords(board);
            // No successful move → returns original coords
            expect(result).toEqual([[0, 3], [0, 4], [1, 3], [1, 4]]);
        });

        it('drops multiple rows until a collision occurs', () => {
            // Allow 3 moves then lock
            hasCollided
                .mockReturnValueOnce(null)
                .mockReturnValueOnce(null)
                .mockReturnValueOnce(null)
                .mockReturnValueOnce(COLLISION.LOCK);

            const t = new Tetromino({
                shape: SHAPE_2x2,
                color: 'red',
                coords: [[0, 3], [0, 4], [1, 3], [1, 4]],
            });

            const result = t.getPredictCoords(board);
            expect(result).toEqual([[3, 3], [3, 4], [4, 3], [4, 4]]);
        });

        it('passes MOVES.DOWN and the board to hasCollided', () => {
            hasCollided.mockReturnValue(COLLISION.LOCK);

            const t = new Tetromino({
                shape: SHAPE_2x2,
                color: 'red',
                coords: [[0, 3]],
            });

            t.getPredictCoords(board);
            expect(hasCollided).toHaveBeenCalledWith(MOVES.DOWN, expect.any(Array), board);
        });
    });
});