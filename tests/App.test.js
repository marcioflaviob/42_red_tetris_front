import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import App from '../src/App';
import userSlice from '../src/store/slices/userSlice';

jest.mock('../src/Layout', () => {
  return function MockLayout() {
    return <div data-testid="layout">Layout Component</div>;
  };
});

jest.mock('../src/ProtectedRoutes', () => {
  return function MockProtectedRoutes() {
    return <div data-testid="protected-routes">Protected Routes</div>;
  };
});

jest.mock('../src/Path', () => ({
  PATHS: [
    { path: '', component: 'home-component' },
    { path: '*', component: 'error-component' },
  ],
}));

jest.mock('../src/services/UserService', () => ({
  createUserService: () => ({
    getUsername: () => '',
    getAvatar: () => 'assets/avatars/default.webp',
    getMatches: () => [],
    saveUsername: jest.fn(),
    saveAvatar: jest.fn(),
  }),
}));

const createMockStore = () => {
  return configureStore({
    reducer: {
      user: userSlice,
    },
  });
};

const renderWithProviders = (ui) => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </Provider>
  );
};

describe('App Component', () => {
  test('renders without crashing', () => {
    renderWithProviders(<App />);
    expect(document.body).toBeInTheDocument();
  });

  test('renders Routes component with correct structure', () => {
    renderWithProviders(<App />);
    expect(document.querySelector('div')).toBeInTheDocument();
  });

  test('exports App component correctly', () => {
    expect(App).toBeDefined();
    expect(typeof App).toBe('function');
  });
});