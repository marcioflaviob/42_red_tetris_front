import userReducer, {
    setUsername,
    setAvatar,
    loadMatchesFromStorage
} from '../../src/store/slices/userSlice';

// Mock the service so we don't hit localStorage/indexedDB during tests
jest.mock('../../src/services/UserService', () => ({
    createUserService: () => ({
        getUsername: jest.fn(() => 'TestUser'),
        getAvatar: jest.fn(() => 'avatar1.png'),
        getMatches: jest.fn(() => Promise.resolve([{ id: 1, score: 100 }])),
        getSessionId: jest.fn(() => 'test-session-id'),
        saveUsername: jest.fn(),
        saveAvatar: jest.fn(),
    }),
}));

describe('userSlice', () => {
    const initialState = {
        username: 'TestUser',
        avatar: 'avatar1.png',
        matches: [],
        sessionId: 'test-session-id',
    };

    test('should return the initial state', () => {
        expect(userReducer(undefined, { type: undefined })).toEqual(initialState);
    });

    test('should handle setUsername', () => {
        const nextState = userReducer(initialState, setUsername('NewName'));
        expect(nextState.username).toBe('NewName');
    });

    test('should handle setAvatar', () => {
        const nextState = userReducer(initialState, setAvatar('new-avatar.png'));
        expect(nextState.avatar).toBe('new-avatar.png');
    });

    test('should handle loadMatchesFromStorage.fulfilled', () => {
        const mockMatches = [{ id: 1, score: 500 }];
        const action = {
            type: loadMatchesFromStorage.fulfilled.type,
            payload: mockMatches
        };
        const nextState = userReducer(initialState, action);
        expect(nextState.matches).toEqual(mockMatches);
    });
});