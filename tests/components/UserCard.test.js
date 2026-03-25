import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserCard from '../../src/components/cards/UserCard';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../src/store/slices/userSlice';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../src/services/UserService', () => ({
  createUserService: jest.fn(() => ({
    getUsername: jest.fn(() => 'TestUser'),
    getAvatar: jest.fn(() => 'avatar1.png'),
    getSessionId: jest.fn(() => 'test-sessionId'),
    getMatches: jest.fn(() => Promise.resolve([])),
    logout: jest.fn(),
    updateUsername: jest.fn(() => Promise.resolve()),
    updateAvatar: jest.fn(() => Promise.resolve()),
    saveUsername: jest.fn(() => Promise.resolve()),
    saveAvatar: jest.fn(() => Promise.resolve()),
  })),
}));

jest.mock('../../src/data/indexedDB/MatchesRepository', () => ({
  createMatchesRepository: jest.fn(() => ({
    getMatches: jest.fn(() => Promise.resolve([{ id: 1, winner: 'test-session', online: true, score: 1000, accuracy: 80 }])),
    saveMatch: jest.fn(() => Promise.resolve()),
  })),
}));

const renderWithProviders = (ui, preloadedState) => {
  const store = configureStore({
    reducer: { user: userReducer },
    preloadedState: preloadedState || {
      user: {
        username: 'TestUser',
        avatar: 'avatar1.png',
        matches: [],
        sessionId: 'test-session'
      }
    }
  });
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('UserCard Component', () => {
  it('renders user information and statistics correctly', async () => {
    renderWithProviders(<UserCard />);
    expect(await screen.findByText('TestUser', { exact: false })).toBeInTheDocument();
    expect(await screen.findByText(/Multiplayer Wins/i, { exact: false })).toBeInTheDocument();
    // Verify stats are calculated
    expect(await screen.findByText('1000')).toBeInTheDocument();
  });

  it('enters and exits edit mode for username', async () => {
    renderWithProviders(<UserCard />);
    const usernameDisplay = await screen.findByText('TestUser', { exact: false });
    fireEvent.click(usernameDisplay);
    
    const input = await screen.findByRole('textbox');
    expect(input).toBeInTheDocument();
    
    fireEvent.change(input, { target: { value: 'NewName' } });
    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
    
    await waitFor(() => {
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('handles username submission on Enter', async () => {
    renderWithProviders(<UserCard />);
    const usernameDisplay = await screen.findByText('TestUser', { exact: false });
    fireEvent.click(usernameDisplay);
    const input = await screen.findByRole('textbox');
    fireEvent.change(input, { target: { value: 'NewName' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    await waitFor(() => {
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
  });

  it('opens avatar selector or overlay on image click', async () => {
    renderWithProviders(<UserCard />);
    const avatar = screen.getByAltText('avatar');
    fireEvent.click(avatar);
    expect(await screen.findByText(/Choose your character/i)).toBeInTheDocument();
  });
});