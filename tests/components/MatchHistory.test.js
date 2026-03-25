import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import MatchHistory from '../../src/components/cards/MatchHistory';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../src/store/slices/userSlice';
import { act } from 'react-dom/test-utils';

// Standardize the mock data
const mockMatches = [
  {
    id: '1',
    date: new Date().toISOString(),
    mode: 'Single',
    result: 'Win',
    score: 1500,
    players: [{ username: 'TestUser' }]
  }
];

jest.mock('../../src/services/UserService', () => ({
  createUserService: jest.fn(() => ({
    getMatches: jest.fn(() => Promise.resolve([])),
    saveMatches: jest.fn(),
    getUsername: jest.fn(() => 'TestUser'),
    getAvatar: jest.fn(() => 'avatar1.png'),
    getSessionId: jest.fn(() => 'test-sessionId'),
  })),
}));

jest.mock('../../src/services/MatchService', () => ({
  createMatchService: jest.fn(() => ({
    getMatches: jest.fn(() => Promise.resolve(mockMatches)),
    createMatch: jest.fn()
  }))
}));

const renderWithProviders = (ui) => {
  const store = configureStore({
    reducer: { user: userReducer },
    preloadedState: {
      user: {
        username: 'TestUser',
        avatar: 'avatar1.png',
        matches: mockMatches,
        sessionId: 'test-session'
      }
    }
  });
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('MatchHistory Component', () => {
  afterEach(cleanup);

  it('renders correctly with matches', async () => {
    // Wrapping the initial render in act to catch immediate useEffect triggers
    await act(async () => {
      renderWithProviders(<MatchHistory />);
    });
    expect(screen.getByText(/Match History/i)).toBeInTheDocument();
  });

  it('renders match items after loading', async () => {
    renderWithProviders(<MatchHistory />);

    // Use findByText: it has built-in act() and waitFor logic
    const scoreElement = await screen.findByText('1,500');

    expect(scoreElement).toBeInTheDocument();
    expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Score/i)).toBeInTheDocument();
    expect(screen.getByText('#1')).toBeInTheDocument();
  });
});