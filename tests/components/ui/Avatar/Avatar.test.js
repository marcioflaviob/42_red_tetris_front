import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import Avatar from '../../../../src/components/ui/Avatar/Avatar';
import userSlice from '../../../../src/store/slices/userSlice';

jest.mock('primereact/avatar', () => ({
  Avatar: ({ image, size, shape, className, onClick }) => (
    <div
      data-testid="prime-avatar"
      data-image={image}
      data-size={size}
      data-shape={shape}
      className={className}
      onClick={onClick}
    >
      Avatar
    </div>
  ),
}));

jest.mock('primereact/overlaypanel', () => ({
  OverlayPanel: jest.fn().mockImplementation(({ children, className }, ref) => (
    <div
      ref={ref}
      data-testid="overlay-panel"
      className={className}
      style={{ display: 'none' }}
    >
      {children}
    </div>
  )),
}));

jest.mock('../../../../src/components/ui/Avatar/Avatar.module.css', () => ({
  avatar: 'avatar',
  avatarEditable: 'avatarEditable',
  pencilButton: 'pencilButton',
  avatarSelector: 'avatarSelector',
  avatarGrid: 'avatarGrid',
  selectorTitle: 'selectorTitle',
  avatarOptions: 'avatarOptions',
  selectedAvatar: 'selectedAvatar',
}));

jest.mock('../../../../src/services/UserService', () => ({
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

describe('Avatar Component', () => {
  test('renders without crashing', () => {
    renderWithStore(<Avatar />);
    expect(screen.getByTestId('prime-avatar')).toBeInTheDocument();
  });

  test('uses avatar from Redux store by default', () => {
    const storeState = {
      user: { avatar: '/custom/avatar.webp' },
    };
    renderWithStore(<Avatar />, storeState);
    const avatar = screen.getByTestId('prime-avatar');
    expect(avatar).toHaveAttribute('data-image', '/custom/avatar.webp');
  });

  test('uses avatarProp when provided', () => {
    const customAvatar = '/prop/avatar.webp';
    renderWithStore(<Avatar avatar={customAvatar} />);
    const avatar = screen.getByTestId('prime-avatar');
    expect(avatar).toHaveAttribute('data-image', customAvatar);
  });

  test('applies size prop correctly', () => {
    renderWithStore(<Avatar size="large" />);
    const avatar = screen.getByTestId('prime-avatar');
    expect(avatar).toHaveAttribute('data-size', 'large');
  });

  test('applies shape prop correctly', () => {
    renderWithStore(<Avatar shape="square" />);
    const avatar = screen.getByTestId('prime-avatar');
    expect(avatar).toHaveAttribute('data-shape', 'square');
  });

  test('shape defaults to circle', () => {
    renderWithStore(<Avatar />);
    const avatar = screen.getByTestId('prime-avatar');
    expect(avatar).toHaveAttribute('data-shape', 'circle');
  });

  test('applies className correctly', () => {
    const customClass = 'custom-avatar';
    renderWithStore(<Avatar className={customClass} />);
    const avatar = screen.getByTestId('prime-avatar');
    expect(avatar).toHaveClass('avatar', customClass);
  });

  test('className defaults to empty string', () => {
    renderWithStore(<Avatar />);
    const avatar = screen.getByTestId('prime-avatar');
    expect(avatar).toHaveClass('avatar');
  });

  test('applies non-editable class when editable is false', () => {
    renderWithStore(<Avatar editable={false} />);
    const avatar = screen.getByTestId('prime-avatar');
    expect(avatar).toHaveClass('avatar');
  });

  test('applies editable class when editable is true', () => {
    renderWithStore(<Avatar editable={true} />);
    const avatars = screen.getAllByTestId('prime-avatar');
    const mainAvatar = avatars[0];
    expect(mainAvatar).toHaveClass('avatarEditable');
  });

  test('does not show pencil button when not editable', () => {
    renderWithStore(<Avatar editable={false} />);
    expect(screen.queryByTestId('pencil-button')).not.toBeInTheDocument();
  });

  test('shows pencil button when editable', () => {
    renderWithStore(<Avatar editable={true} />);
    const pencilButton = document.querySelector('.pencilButton');
    expect(pencilButton).toBeInTheDocument();
  });

  test('does not show overlay when not editable', () => {
    renderWithStore(<Avatar editable={false} />);
    expect(screen.queryByTestId('overlay-panel')).not.toBeInTheDocument();
  });

  test('shows overlay when editable', () => {
    renderWithStore(<Avatar editable={true} />);
    expect(screen.getByTestId('overlay-panel')).toBeInTheDocument();
  });

  test('renders avatar options in overlay when editable', () => {
    renderWithStore(<Avatar editable={true} />);
    expect(screen.getByText('Choose Avatar')).toBeInTheDocument();
    
    const avatarOptions = document.querySelectorAll('.avatarOptions .avatar');
    expect(avatarOptions).toHaveLength(14);
  });

  test('handles avatar click when not editable - no action', () => {
    renderWithStore(<Avatar editable={false} />);
    const avatar = screen.getByTestId('prime-avatar');
    
    expect(() => fireEvent.click(avatar)).not.toThrow();
  });

  test('component exports correctly', () => {
    expect(Avatar).toBeDefined();
    expect(typeof Avatar).toBe('function');
  });

  test('renders with all default props', () => {
    renderWithStore(<Avatar />);
    const avatar = screen.getByTestId('prime-avatar');
    
    expect(avatar).toHaveAttribute('data-shape', 'circle');
    expect(avatar).toHaveClass('avatar');
    expect(avatar).toHaveAttribute('data-image', 'assets/avatars/default.webp');
  });

  test('editable defaults to false', () => {
    renderWithStore(<Avatar />);
    const avatar = screen.getByTestId('prime-avatar');
    expect(avatar).toHaveClass('avatar');
    expect(avatar).not.toHaveClass('avatarEditable');
  });

  test('renders correct avatar options structure', () => {
    renderWithStore(<Avatar editable={true} />);
    
    const avatarGrid = document.querySelector('.avatarGrid');
    const selectorTitle = document.querySelector('.selectorTitle');
    const avatarOptions = document.querySelector('.avatarOptions');
    
    expect(avatarGrid).toBeInTheDocument();
    expect(selectorTitle).toBeInTheDocument();
    expect(avatarOptions).toBeInTheDocument();
  });

  test('avatar options include default and numbered avatars', () => {
    renderWithStore(<Avatar editable={true} />);
    
    const avatarElements = document.querySelectorAll('.avatarOptions .avatar');
    expect(avatarElements).toHaveLength(14);
  });

  test('avatar prop overrides store avatar', () => {
    const storeState = {
      user: { avatar: '/store/avatar.webp' },
    };
    const propAvatar = '/prop/avatar.webp';
    
    renderWithStore(<Avatar avatar={propAvatar} />, storeState);
    const avatar = screen.getByTestId('prime-avatar');
    expect(avatar).toHaveAttribute('data-image', propAvatar);
  });
});