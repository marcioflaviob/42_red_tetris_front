import { getRandom, hasCollided, getIndex, getCell, getColorHex } from '../../src/utils/helper';
import { MOVES, COLLISION, BOARD_COLS, BOARD_ROWS, BUFFER_ZONE_ROWS, COLOR } from '../../src/utils/constants';

describe('helper', () => {
    describe('getRandom', () => {
        it('returns a random element from an array', () => {
            const arr = [1, 2, 3];
            const result = getRandom(arr, () => 0.5);
            expect(result).toBe(2);
        });
    });

    describe('getIndex', () => {
        it('returns correct index', () => {
            expect(getIndex([2, 5])).toBe(2 * BOARD_COLS + 5);
        });
    });

    describe('getCell', () => {
        it('returns correct cell from board', () => {
            const board = new Array(200).fill(0);
            const index = 2 * BOARD_COLS + 5;
            board[index] = 1;
            expect(getCell([2, 5], board)).toBe(1);
        });
    });

    describe('getColorHex', () => {
        beforeAll(() => {
            Object.defineProperty(window, 'getComputedStyle', {
                value: () => ({
                    getPropertyValue: (prop) => {
                        const colors = {
                            '--purple': '#800080',
                            '--mustard': '#FFDB58',
                            '--panther': '#E68FAC',
                            '--wine': '#722F37',
                            '--grass': '#4CBB17',
                            '--royal': '#4169E1',
                            '--turk': '#40E0D0',
                        };
                        return colors[prop] || '';
                    }
                })
            });
        });

        it('returns correct hex for a given color', () => {
            expect(getColorHex(COLOR.PURPLE)).toBe('#800080');
            expect(getColorHex(COLOR.MUSTARD)).toBe('#FFDB58');
            expect(getColorHex(COLOR.PANTHER)).toBe('#E68FAC');
            expect(getColorHex(COLOR.WINE)).toBe('#722F37');
            expect(getColorHex(COLOR.GRASS)).toBe('#4CBB17');
            expect(getColorHex(COLOR.ROYAL)).toBe('#4169E1');
            expect(getColorHex(COLOR.TURK)).toBe('#40E0D0');
            expect(getColorHex('UNKNOWN')).toBe('#FFDB58');
        });
    });

    describe('hasCollided', () => {
        const board = new Array((BUFFER_ZONE_ROWS + BOARD_ROWS) * BOARD_COLS).fill(0);

        it('returns NO when coords are empty', () => {
            expect(hasCollided(MOVES.DOWN, null, board)).toBe(COLLISION.NO);
        });

        it('returns CONTINUE if col is out of bounds', () => {
            expect(hasCollided(MOVES.LEFT, [[0, -1]], board)).toBe(COLLISION.CONTINUE);
            expect(hasCollided(MOVES.RIGHT, [[0, BOARD_COLS]], board)).toBe(COLLISION.CONTINUE);
        });

        it('returns LOCK if moving DOWN and hits bottom edge', () => {
            expect(hasCollided(MOVES.DOWN, [[BUFFER_ZONE_ROWS + BOARD_ROWS, 5]], board)).toBe(COLLISION.LOCK);
        });

        it('returns LOCK if moving DOWN and hits a filled cell', () => {
            const customBoard = [...board];
            customBoard[getIndex([5, 5])] = 1;
            expect(hasCollided(MOVES.DOWN, [[5, 5]], customBoard)).toBe(COLLISION.LOCK);
        });

        it('returns CONTINUE if moving side/rotate and hits bottom edge or filled cell', () => {
            const customBoard = [...board];
            customBoard[getIndex([5, 5])] = 1;
            expect(hasCollided(MOVES.RIGHT, [[BUFFER_ZONE_ROWS + BOARD_ROWS, 5]], customBoard)).toBe(COLLISION.CONTINUE);
            expect(hasCollided(MOVES.LEFT, [[5, 5]], customBoard)).toBe(COLLISION.CONTINUE);
        });

        it('returns NO when no collision occurs', () => {
            expect(hasCollided(MOVES.DOWN, [[5, 5]], board)).toBe(COLLISION.NO);
        });
    });
});