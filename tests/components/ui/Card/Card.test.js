import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import Card from '../../../../src/components/ui/Card/Card';
import userSlice from '../../../../src/store/slices/userSlice';

jest.mock('../../../../src/components/ui/Card/Card.module.css', () => ({
  card: 'card',
  usernameRequired: 'usernameRequired',
  usernamePrompt: 'usernamePrompt',
  usernamePromptMessage: 'usernamePromptMessage',
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

describe('Card Component', () => {
  test('renders children correctly', () => {
    const testContent = 'Test Content';
    renderWithStore(<Card>{testContent}</Card>);
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  test('applies className prop correctly', () => {
    const testClass = 'test-class';
    const { container } = renderWithStore(<Card className={testClass}>Content</Card>);
    expect(container.firstChild).toHaveClass('card', testClass);
  });

  test('renders without className', () => {
    const { container } = renderWithStore(<Card>Content</Card>);
    expect(container.firstChild).toHaveClass('card');
    expect(container.firstChild).toBeInTheDocument();
  });

  test('handles multiple children', () => {
    renderWithStore(
      <Card>
        <div>Child 1</div>
        <div>Child 2</div>
      </Card>
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  test('does not show username prompt when isUsernameRequired is false', () => {
    renderWithStore(<Card isUsernameRequired={false}>Content</Card>);
    expect(screen.queryByText('Please set a username first')).not.toBeInTheDocument();
  });

  test('does not show username prompt when username exists and isUsernameRequired is true', () => {
    const storeState = {
      user: { username: 'testuser' },
    };
    renderWithStore(<Card isUsernameRequired={true}>Content</Card>, storeState);
    expect(screen.queryByText('Please set a username first')).not.toBeInTheDocument();
  });

  test('shows username prompt when username is empty and isUsernameRequired is true', () => {
    renderWithStore(<Card isUsernameRequired={true}>Content</Card>);
    expect(screen.getByText('Please set a username first')).toBeInTheDocument();
  });

  test('shows username prompt when username is whitespace and isUsernameRequired is true', () => {
    const storeState = {
      user: { username: '   ' },
    };
    renderWithStore(<Card isUsernameRequired={true}>Content</Card>, storeState);
    expect(screen.getByText('Please set a username first')).toBeInTheDocument();
  });

  test('applies usernameRequired class when username is required but empty', () => {
    const { container } = renderWithStore(<Card isUsernameRequired={true}>Content</Card>);
    expect(container.firstChild).toHaveClass('card', 'usernameRequired');
  });

  test('does not apply usernameRequired class when username exists', () => {
    const storeState = {
      user: { username: 'testuser' },
    };
    const { container } = renderWithStore(<Card isUsernameRequired={true}>Content</Card>, storeState);
    expect(container.firstChild).toHaveClass('card');
    expect(container.firstChild).not.toHaveClass('usernameRequired');
  });

  test('username prompt has correct structure and classes', () => {
    const { container } = renderWithStore(<Card isUsernameRequired={true}>Content</Card>);
    const prompt = container.querySelector('.usernamePrompt');
    const message = container.querySelector('.usernamePromptMessage');
    
    expect(prompt).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(message).toHaveTextContent('Please set a username first');
  });

  test('isUsernameRequired defaults to false', () => {
    renderWithStore(<Card>Content</Card>);
    expect(screen.queryByText('Please set a username first')).not.toBeInTheDocument();
  });

  test('className defaults to empty string', () => {
    const { container } = renderWithStore(<Card>Content</Card>);
    expect(container.firstChild).toHaveClass('card');
  });
});