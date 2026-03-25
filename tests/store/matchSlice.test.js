import matchReducer, { setRoomInfo } from '../../src/store/slices/matchSlice';

describe('matchSlice', () => {
    const initialState = {
        roomId: null,
        host: null,
        players: [],
        invisiblePieces: false,
        increasedGravity: false,
    };

    it('should return the initial state', () => {
        expect(matchReducer(undefined, { type: undefined })).toEqual(initialState);
    });

    it('should handle setRoomInfo', () => {
        const payload = {
            roomId: '123',
            host: 'Alice',
            players: ['Alice', 'Bob'],
            invisiblePieces: true,
            increasedGravity: false,
        };
        const actual = matchReducer(initialState, setRoomInfo(payload));
        expect(actual.roomId).toEqual('123');
        expect(actual.host).toEqual('Alice');
        expect(actual.players).toEqual(['Alice', 'Bob']);
        expect(actual.invisiblePieces).toBe(true);
    });
});
