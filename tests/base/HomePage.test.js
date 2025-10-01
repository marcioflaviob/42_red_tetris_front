import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import HomePage from '../../src/base/HomePage';
import userSlice from '../../src/store/slices/userSlice';

jest.mock('../../src/base/HomePage.module.css', () => ({
  content: 'content',
}));

jest.mock('../../src/components/ui/Card/Card', () => {
  return function MockCard({ children, className, isUsernameRequired }) {
    return (
      <div 
        data-testid="card" 
        className={className}
        data-username-required={isUsernameRequired}
      >
        {children}
      </div>
    );
  };
});

jest.mock('../../src/components/cards/UserCard', () => {
  return function MockUserCard() {
    return <div data-testid="user-card">User Card</div>;
  };
});

jest.mock('../../src/components/cards/OfflineCard', () => {
  return function MockOfflineCard() {
    return <div data-testid="offline-card">Offline Card</div>;
  };
});

jest.mock('../../src/services/UserService', () => ({
  createUserService: () => ({
    getUsername: () => '',
    getAvatar: () => 'assets/avatars/default.webp',
    getMatches: () => [],
    saveUsername: jest.fn(),
    saveAvatar: jest.fn(),
  }),
}));

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      user: userSlice,
    },
    preloadedState: {
      user: {
        username: '',
        avatar: 'assets/avatars/default.webp',
        matches: [],
        ...initialState.user,
      },
    },
  });
};

const renderWithStore = (ui, storeState = {}) => {
  const store = createMockStore(storeState);
  return render(
    <Provider store={store}>
      {ui}
    </Provider>
  );
};

describe('HomePage Component', () => {
  test('renders without crashing', () => {
    renderWithStore(<HomePage />);
    expect(screen.getAllByTestId('card')).toHaveLength(5);
  });

  test('shows welcome message when no username', () => {
    renderWithStore(<HomePage />);
    expect(screen.getByText(/Welcome, set a username and invite others to play/)).toBeInTheDocument();
  });

  test('hides welcome message when username exists', () => {
    const storeState = {
      user: {
        username: 'testuser',
      },
    };
    renderWithStore(<HomePage />, storeState);
    expect(screen.queryByText(/Welcome, set a username and invite others to play/)).not.toBeInTheDocument();
  });

  test('renders UserCard component', () => {
    renderWithStore(<HomePage />);
    expect(screen.getByTestId('user-card')).toBeInTheDocument();
  });

  test('renders OfflineCard component', () => {
    renderWithStore(<HomePage />);
    expect(screen.getByTestId('offline-card')).toBeInTheDocument();
  });

  test('renders history card with correct text', () => {
    renderWithStore(<HomePage />);
    expect(screen.getByText('History of matches here')).toBeInTheDocument();
  });

  test('renders play online card with correct text', () => {
    renderWithStore(<HomePage />);
    expect(screen.getByText('Play online')).toBeInTheDocument();
  });

  test('applies correct CSS classes', () => {
    const { container } = renderWithStore(<HomePage />);
    const contentDiv = container.querySelector('.content');
    expect(contentDiv).toBeInTheDocument();
    expect(contentDiv).toHaveClass('flex', 'flex-col', 'h-full');
  });

  test('sets isUsernameRequired prop on appropriate cards', () => {
    renderWithStore(<HomePage />);
    const cards = screen.getAllByTestId('card');
    
    const cardsWithUsernameRequired = cards.filter(card => 
      card.getAttribute('data-username-required') === 'true'
    );
    
    expect(cardsWithUsernameRequired).toHaveLength(2);
  });

  test('applies correct grid layout classes', () => {
    const { container } = renderWithStore(<HomePage />);
    const gridContainer = container.querySelector('.grid.grid-cols-3');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass('row-span-10', 'gap-8', 'flex-1', 'p-8');
  });

  test('welcome card has correct container classes when shown', () => {
    renderWithStore(<HomePage />);
    const { container } = renderWithStore(<HomePage />);
    const welcomeContainer = container.querySelector('.container.mx-auto.flex-none');
    expect(welcomeContainer).toBeInTheDocument();
  });
});