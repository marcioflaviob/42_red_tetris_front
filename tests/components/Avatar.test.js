import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Avatar from '../../src/components/ui/Avatar/Avatar';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../src/store/slices/userSlice';

jest.mock('../../src/services/UserService', () => ({
  createUserService: jest.fn(() => ({
    getUsername: jest.fn(() => 'TestUser'),
    getAvatar: jest.fn(() => 'avatar1.png'),
    getSessionId: jest.fn(() => 'test-sessionId'),
    saveAvatar: jest.fn(() => Promise.resolve()),
  })),
}));

const renderWithProviders = (ui, preloadedState) => {
  const store = configureStore({
    reducer: { user: userReducer },
    preloadedState: preloadedState || {
      user: {
        avatar: 'avatar1.png',
      }
    }
  });
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('Avatar Component', () => {
  it('renders prop avatar when provided', () => {
    renderWithProviders(<Avatar avatar='avatar2.png' />);
    const img = screen.getByAltText('avatar');
    expect(img.src).toContain('avatar2.png');
  });

  it('renders redux avatar when no prop is provided', () => {
    renderWithProviders(<Avatar />);
    const img = screen.getByAltText('avatar');
    expect(img.src).toContain('avatar1.png');
  });

  it('opens dialog when editable avatar is clicked', async () => {
    renderWithProviders(<Avatar editable={true} />);
    const avatarImg = screen.getByAltText('avatar');
    fireEvent.click(avatarImg);
    expect(await screen.findByText(/Choose your character/i)).toBeInTheDocument();
  });

  it('filters avatars by category', async () => {
    renderWithProviders(<Avatar editable={true} />);
    fireEvent.click(screen.getByAltText('avatar'));
    await screen.findByText(/Choose your character/i);
    
    const evilIcon = screen.getByAltText('evil-class');
    fireEvent.click(evilIcon);
    
    const images = screen.getAllByRole('img');
    const avatarOptions = images.filter(img => img.src.includes('/avatarsCircled/'));
    avatarOptions.forEach(img => {
       expect(img.src).toContain('evil');
    });
  });

  it('handles avatar selection', async () => {
    renderWithProviders(<Avatar editable={true} />);
    fireEvent.click(screen.getByAltText('avatar'));
    await screen.findByText(/Choose your character/i);

    // Click the avatar option
    const images = screen.getAllByRole('img');
    const avatarOption = images.find(img => img.src.includes('/avatarsCircled/avatar2.webp'));
    fireEvent.click(avatarOption);

    // Use waitFor to allow PrimeReact Dialog animations/state updates to complete
    await waitFor(() => {
      expect(screen.queryByText(/Choose your character/i)).not.toBeInTheDocument();
    });
  });

  it('toggles category filter on second click', async () => {
    renderWithProviders(<Avatar editable={true} />);
    fireEvent.click(screen.getByAltText('avatar'));
    await screen.findByText(/Choose your character/i);

    const goodIcon = screen.getByAltText('good-class');
    fireEvent.click(goodIcon); // Select good
    fireEvent.click(goodIcon); // Unselect good

    const images = screen.getAllByRole('img');
    const avatarOptions = images.filter(img => img.src.includes('/avatarsCircled/'));
    // Should show all (including evil)
    expect(avatarOptions.some(img => img.src.includes('evil'))).toBe(true);
  });
});