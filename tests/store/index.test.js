import { store } from '../../src/store/index';
import userSlice from '../../src/store/slices/userSlice';

// Mock the UserService
jest.mock('../../src/services/UserService', () => ({
  createUserService: () => ({
    getUsername: jest.fn(() => ''),
    getAvatar: jest.fn(() => 'assets/avatars/default.webp'),
    getMatches: jest.fn(() => []),
    saveUsername: jest.fn(),
    saveAvatar: jest.fn(),
  }),
}));

describe('Redux Store', () => {
  test('store should be configured correctly', () => {
    expect(store).toBeDefined();
    expect(typeof store).toBe('object');
    expect(typeof store.dispatch).toBe('function');
    expect(typeof store.getState).toBe('function');
    expect(typeof store.subscribe).toBe('function');
  });

  test('store should have user reducer', () => {
    const state = store.getState();
    expect(state).toHaveProperty('user');
    expect(state.user).toBeDefined();
  });

  test('store should have initial user state', () => {
    const state = store.getState();
    expect(state.user).toHaveProperty('username');
    expect(state.user).toHaveProperty('avatar');
    expect(state.user).toHaveProperty('matches');
  });

  test('store should accept dispatched actions', () => {
    const initialState = store.getState();
    
    store.dispatch({ type: 'user/setUsername', payload: 'testuser' });
    
    const newState = store.getState();
    expect(newState.user.username).toBe('testuser');
    expect(newState).not.toBe(initialState);
  });

  test('store should be immutable', () => {
    const state1 = store.getState();
    const state2 = store.getState();
    
    // States should be referentially equal (same object)
    expect(state1).toBe(state2);
    
    // Dispatch an action
    store.dispatch({ type: 'user/setUsername', payload: 'newuser' });
    
    const state3 = store.getState();
    // New state should be different object
    expect(state3).not.toBe(state1);
    expect(state3.user.username).toBe('newuser');
  });

  test('store should handle multiple actions', () => {
    store.dispatch({ type: 'user/setUsername', payload: 'user1' });
    store.dispatch({ type: 'user/setAvatar', payload: 'avatar1.webp' });
    
    const state = store.getState();
    expect(state.user.username).toBe('user1');
    expect(state.user.avatar).toBe('avatar1.webp');
  });

  test('store should use userSlice reducer', () => {
    // Test that the store is using the userSlice reducer by checking behavior
    const testAction = { type: 'user/setUsername', payload: 'testuser' };
    
    // Get the result from the store
    store.dispatch(testAction);
    const storeState = store.getState().user;
    
    // Verify the action was handled correctly
    expect(storeState.username).toBe('testuser');
    expect(storeState).toHaveProperty('avatar');
    expect(storeState).toHaveProperty('matches');
  });

  test('store should have correct reducer configuration', () => {
    const state = store.getState();
    const reducerNames = Object.keys(state);
    
    expect(reducerNames).toContain('user');
    expect(reducerNames).toHaveLength(1);
  });

  test('store exports correctly', () => {
    expect(store).toBeDefined();
    expect(typeof store).toBe('object');
  });

  test('store should allow subscription to state changes', () => {
    const mockListener = jest.fn();
    const unsubscribe = store.subscribe(mockListener);
    
    expect(typeof unsubscribe).toBe('function');
    
    store.dispatch({ type: 'user/setUsername', payload: 'subscriptiontest' });
    expect(mockListener).toHaveBeenCalled();
    
    unsubscribe();
    
    // After unsubscribing, listener should not be called
    mockListener.mockClear();
    store.dispatch({ type: 'user/setUsername', payload: 'afterunsubscribe' });
    expect(mockListener).not.toHaveBeenCalled();
  });

  test('store should handle unknown actions gracefully', () => {
    const initialState = store.getState();
    
    store.dispatch({ type: 'unknown/action', payload: 'test' });
    
    const newState = store.getState();
    // State should remain the same for unknown actions
    expect(newState.user).toEqual(initialState.user);
  });
});