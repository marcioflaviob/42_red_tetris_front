import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import UserCard from '../../../src/components/cards/UserCard';
import userSlice from '../../../src/store/slices/userSlice';

// Mock CSS modules
jest.mock('../../../src/components/cards/UserCard.module.css', () => ({
  profileSection: 'profileSection',
  cardHeader: 'cardHeader',
  usernameSection: 'usernameSection',
  usernameInput: 'usernameInput',
  usernameDisplay: 'usernameDisplay',
  statsSection: 'statsSection',
  statsGrid: 'statsGrid',
  statItem: 'statItem',
  statValue: 'statValue',
  statLabel: 'statLabel',
}));

// Mock components
jest.mock('../../../src/components/ui/Inputs/InputText', () => {
  return jest.fn().mockImplementation(function MockInputText({ value, onChange, onKeyDown, onBlur, placeholder, className, id, name, type }, ref) {
    return (
      <input
        ref={ref}
        data-testid="input-text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        placeholder={placeholder}
        className={className}
        id={id}
        name={name}
        type={type}
      />
    );
  });
});

jest.mock('../../../src/components/ui/Avatar/Avatar', () => {
  return function MockAvatar({ size, editable }) {
    return <div data-testid="avatar" data-size={size} data-editable={editable}>Avatar</div>;
  };
});

jest.mock('../../../src/components/ui/Titles/Title', () => {
  return function MockTitle({ children, className }) {
    return <h2 data-testid="title" className={className}>{children}</h2>;
  };
});

jest.mock('../../../src/components/ui/Card/InfoCard', () => {
  return function MockInfoCard({ children, className }) {
    return <div data-testid="info-card" className={className}>{children}</div>;
  };
});

// Mock services to avoid localStorage issues
jest.mock('../../../src/services/UserService', () => ({
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
  return { store, ...render(<Provider store={store}>{ui}</Provider>) };
};

describe('UserCard Component', () => {
  test('renders without crashing', () => {
    renderWithStore(<UserCard />);
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
  });

  test('displays default username prompt when no username', () => {
    renderWithStore(<UserCard />);
    expect(screen.getByText('Click to set username')).toBeInTheDocument();
  });

  test('displays username when set', () => {
    const storeState = {
      user: { username: 'testuser' },
    };
    renderWithStore(<UserCard />, storeState);
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  test('renders avatar with correct props', () => {
    renderWithStore(<UserCard />);
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toHaveAttribute('data-size', 'xlarge');
    expect(avatar).toHaveAttribute('data-editable', 'true');
  });

  test('shows stats section when username exists', () => {
    const storeState = {
      user: { username: 'testuser' },
    };
    renderWithStore(<UserCard />, storeState);
    expect(screen.getByText('Wins')).toBeInTheDocument();
    expect(screen.getByText('Best Score')).toBeInTheDocument();
  });

  test('hides stats section when no username', () => {
    renderWithStore(<UserCard />);
    expect(screen.queryByText('Wins')).not.toBeInTheDocument();
    expect(screen.queryByText('Best Score')).not.toBeInTheDocument();
  });

  test('displays correct user stats', () => {
    const storeState = {
      user: { username: 'testuser' },
    };
    renderWithStore(<UserCard />, storeState);
    expect(screen.getByText('28')).toBeInTheDocument(); // Wins
    expect(screen.getByText('15,420')).toBeInTheDocument(); // Best Score formatted
  });

  test('enters edit mode when username is clicked', () => {
    const storeState = {
      user: { username: 'testuser' },
    };
    renderWithStore(<UserCard />, storeState);
    
    const usernameDisplay = screen.getByText('testuser');
    fireEvent.click(usernameDisplay);
    
    expect(screen.getByTestId('input-text')).toBeInTheDocument();
  });

  test('enters edit mode when default prompt is clicked', () => {
    renderWithStore(<UserCard />);
    
    const usernameDisplay = screen.getByText('Click to set username');
    fireEvent.click(usernameDisplay);
    
    expect(screen.getByTestId('input-text')).toBeInTheDocument();
  });

  test('input field has correct placeholder', () => {
    renderWithStore(<UserCard />);
    
    const usernameDisplay = screen.getByText('Click to set username');
    fireEvent.click(usernameDisplay);
    
    const input = screen.getByTestId('input-text');
    expect(input).toHaveAttribute('placeholder', 'Enter your username');
  });

  test('input field shows current username value', () => {
    const storeState = {
      user: { username: 'testuser' },
    };
    renderWithStore(<UserCard />, storeState);
    
    const usernameDisplay = screen.getByText('testuser');
    fireEvent.click(usernameDisplay);
    
    const input = screen.getByTestId('input-text');
    expect(input).toHaveValue('testuser');
  });

  test('saves username on Enter key press', async () => {
    const { store } = renderWithStore(<UserCard />);
    
    const usernameDisplay = screen.getByText('Click to set username');
    fireEvent.click(usernameDisplay);
    
    const input = screen.getByTestId('input-text');
    fireEvent.change(input, { target: { value: 'newuser' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    await waitFor(() => {
      expect(store.getState().user.username).toBe('newuser');
    });
  });

  test('saves username on blur', async () => {
    const { store } = renderWithStore(<UserCard />);
    
    const usernameDisplay = screen.getByText('Click to set username');
    fireEvent.click(usernameDisplay);
    
    const input = screen.getByTestId('input-text');
    fireEvent.change(input, { target: { value: 'newuser' } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(store.getState().user.username).toBe('newuser');
    });
  });

  test('cancels edit on Escape key press', () => {
    const storeState = {
      user: { username: 'testuser' },
    };
    renderWithStore(<UserCard />, storeState);
    
    const usernameDisplay = screen.getByText('testuser');
    fireEvent.click(usernameDisplay);
    
    const input = screen.getByTestId('input-text');
    fireEvent.change(input, { target: { value: 'newuser' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.queryByTestId('input-text')).not.toBeInTheDocument();
  });

  test('trims whitespace when saving username', async () => {
    const { store } = renderWithStore(<UserCard />);
    
    const usernameDisplay = screen.getByText('Click to set username');
    fireEvent.click(usernameDisplay);
    
    const input = screen.getByTestId('input-text');
    fireEvent.change(input, { target: { value: '  newuser  ' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    await waitFor(() => {
      expect(store.getState().user.username).toBe('newuser');
    });
  });

  test('does not save empty username', () => {
    const { store } = renderWithStore(<UserCard />);
    
    const usernameDisplay = screen.getByText('Click to set username');
    fireEvent.click(usernameDisplay);
    
    const input = screen.getByTestId('input-text');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(store.getState().user.username).toBe('');
  });

  test('input field has correct attributes', () => {
    renderWithStore(<UserCard />);
    
    const usernameDisplay = screen.getByText('Click to set username');
    fireEvent.click(usernameDisplay);
    
    const input = screen.getByTestId('input-text');
    expect(input).toHaveAttribute('id', 'username');
    expect(input).toHaveAttribute('name', 'username');
    expect(input).toHaveAttribute('type', 'text');
  });

  test('applies correct CSS classes', () => {
    const { container } = renderWithStore(<UserCard />);
    expect(container.querySelector('.profileSection')).toBeInTheDocument();
    expect(container.querySelector('.cardHeader')).toBeInTheDocument();
    expect(container.querySelector('.usernameSection')).toBeInTheDocument();
  });

  test('renders InfoCard components for stats', () => {
    const storeState = {
      user: { username: 'testuser' },
    };
    renderWithStore(<UserCard />, storeState);
    
    const infoCards = screen.getAllByTestId('info-card');
    expect(infoCards).toHaveLength(2);
  });

  test('stats have correct structure', () => {
    const storeState = {
      user: { username: 'testuser' },
    };
    const { container } = renderWithStore(<UserCard />, storeState);
    
    expect(container.querySelector('.statsSection')).toBeInTheDocument();
    expect(container.querySelector('.statsGrid')).toBeInTheDocument();
  });

  test('username display has correct title attribute', () => {
    const storeState = {
      user: { username: 'testuser' },
    };
    renderWithStore(<UserCard />, storeState);
    
    const usernameDisplay = screen.getByText('testuser');
    expect(usernameDisplay).toHaveAttribute('title', 'Click to edit username');
  });

  test('handles input change correctly', () => {
    renderWithStore(<UserCard />);
    
    const usernameDisplay = screen.getByText('Click to set username');
    fireEvent.click(usernameDisplay);
    
    const input = screen.getByTestId('input-text');
    fireEvent.change(input, { target: { value: 'typing...' } });
    
    expect(input).toHaveValue('typing...');
  });

  test('component exports correctly', () => {
    expect(UserCard).toBeDefined();
    expect(typeof UserCard).toBe('function');
  });
});