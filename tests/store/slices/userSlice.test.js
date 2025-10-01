import { configureStore } from '@reduxjs/toolkit';
import userSlice, { setUsername, setAvatar, selectUsername, selectAvatar } from '../../../src/store/slices/userSlice';

jest.mock('../../../src/services/UserService', () => ({
  createUserService: () => ({
    getUsername: jest.fn(() => ''),
    getAvatar: jest.fn(() => 'assets/avatars/default.webp'),
    getMatches: jest.fn(() => []),
    saveUsername: jest.fn(),
    saveAvatar: jest.fn(),
  }),
}));

describe('userSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userSlice,
      },
    });
    jest.clearAllMocks();
  });

  test('should return initial state', () => {
    const state = store.getState().user;
    expect(state).toHaveProperty('username');
    expect(state).toHaveProperty('avatar');
    expect(state).toHaveProperty('matches');
  });

  test('setUsername should update username', () => {
    const newUsername = 'testuser';
    store.dispatch(setUsername(newUsername));

    const state = store.getState().user;
    expect(state.username).toBe(newUsername);
  });

  test('setAvatar should update avatar', () => {
    const newAvatar = 'new-avatar.webp';
    store.dispatch(setAvatar(newAvatar));

    const state = store.getState().user;
    expect(state.avatar).toBe(newAvatar);
  });

  test('selectUsername selector should return username', () => {
    store.dispatch(setUsername('testuser'));
    const state = store.getState();
    const username = selectUsername(state);
    expect(username).toBe('testuser');
  });

  test('selectAvatar selector should return avatar', () => {
    store.dispatch(setAvatar('test-avatar.webp'));
    const state = store.getState();
    const avatar = selectAvatar(state);
    expect(avatar).toBe('test-avatar.webp');
  });

  test('should handle multiple username updates', () => {
    store.dispatch(setUsername('user1'));
    store.dispatch(setUsername('user2'));
    store.dispatch(setUsername('user3'));

    const state = store.getState().user;
    expect(state.username).toBe('user3');
  });

  test('should handle multiple avatar updates', () => {
    store.dispatch(setAvatar('avatar1.webp'));
    store.dispatch(setAvatar('avatar2.webp'));
    store.dispatch(setAvatar('avatar3.webp'));

    const state = store.getState().user;
    expect(state.avatar).toBe('avatar3.webp');
  });

  test('should handle empty string username', () => {
    store.dispatch(setUsername('testuser'));
    store.dispatch(setUsername(''));

    const state = store.getState().user;
    expect(state.username).toBe('');
  });

  test('should handle null/undefined username', () => {
    store.dispatch(setUsername(null));
    const state = store.getState().user;
    expect(state.username).toBe(null);

    store.dispatch(setUsername(undefined));
    const updatedState = store.getState().user;
    expect(updatedState.username).toBe(undefined);
  });

  test('actions should be exported correctly', () => {
    expect(setUsername).toBeDefined();
    expect(setAvatar).toBeDefined();
    expect(typeof setUsername).toBe('function');
    expect(typeof setAvatar).toBe('function');
  });

  test('selectors should be exported correctly', () => {
    expect(selectUsername).toBeDefined();
    expect(selectAvatar).toBeDefined();
    expect(typeof selectUsername).toBe('function');
    expect(typeof selectAvatar).toBe('function');
  });

  test('reducer should be exported as default', () => {
    expect(userSlice).toBeDefined();
    expect(typeof userSlice).toBe('function');
  });

  test('should maintain other state properties when updating username', () => {
    const initialState = store.getState().user;
    store.dispatch(setUsername('testuser'));
    
    const newState = store.getState().user;
    expect(newState.avatar).toBe(initialState.avatar);
    expect(newState.matches).toEqual(initialState.matches);
  });

  test('should maintain other state properties when updating avatar', () => {
    const initialState = store.getState().user;
    store.dispatch(setAvatar('new-avatar.webp'));
    
    const newState = store.getState().user;
    expect(newState.username).toBe(initialState.username);
    expect(newState.matches).toEqual(initialState.matches);
  });
});