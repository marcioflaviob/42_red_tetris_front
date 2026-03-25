import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MatchStats from '../../src/components/cards/MatchStats';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../src/store/slices/userSlice';

jest.mock('../../src/services/UserService', () => ({
  createUserService: jest.fn(() => ({
    getUsername: jest.fn(() => 'TestUser'),
    getAvatar: jest.fn(() => 'avatar1.png'),
    getSessionId: jest.fn(() => 'test-sessionId'),
    getMatches: jest.fn(() => Promise.resolve([])),
  })),
}));

const mockMatches = [
  {
    id: '1',
    date: new Date().toISOString(),
    mode: 'Single',
    result: 'Win',
    score: 1500,
    players: [{ username: 'TestUser' }]
  },
  {
    id: '2',
    date: new Date().toISOString(),
    mode: 'Single',
    result: 'Loss',
    score: 500,
    players: [{ username: 'TestUser' }]
  }
];

const renderWithProviders = (ui, preloadedState) => {
  const store = configureStore({
    reducer: { user: userReducer },
    preloadedState: preloadedState || {
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

describe('MatchStats Component', () => {
  it('renders lobby info when multi-game context', () => {
    renderWithProviders(<MatchStats />);
    expect(screen.getByText(/Match Room/i)).toBeInTheDocument();
    expect(screen.getByText(/Room ID/i)).toBeInTheDocument();
    expect(screen.getByText(/Status/i)).toBeInTheDocument();
  });
  
  it('renders players list header', () => {
    renderWithProviders(<MatchStats />);
    expect(screen.getByText(/Players in Lobby/i)).toBeInTheDocument();
  });
});