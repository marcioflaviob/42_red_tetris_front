import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Layout from '../src/Layout';

jest.mock('../src/base/Header', () => {
  return function MockHeader({ className }) {
    return <header data-testid="header" className={className}>Header</header>;
  };
});

jest.mock('../src/base/Footer', () => {
  return function MockFooter({ className }) {
    return <footer data-testid="footer" className={className}>Footer</footer>;
  };
});

jest.mock('../src/Layout.module.css', () => ({
  layout: 'layout',
  header: 'header',
  main: 'main',
  footer: 'footer',
}));

const renderWithRouter = (ui) => {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
};

describe('Layout Component', () => {
  test('renders layout structure correctly', () => {
    renderWithRouter(<Layout />);
    
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('applies correct CSS classes', () => {
    renderWithRouter(<Layout />);
    
    const header = screen.getByTestId('header');
    const footer = screen.getByTestId('footer');
    const main = screen.getByRole('main');
    
    expect(header).toHaveClass('header');
    expect(footer).toHaveClass('footer');
    expect(main).toHaveClass('main');
  });

  test('contains layout wrapper div with correct class', () => {
    const { container } = renderWithRouter(<Layout />);
    const layoutDiv = container.querySelector('.layout');
    expect(layoutDiv).toBeInTheDocument();
  });

  test('renders Outlet component within main element', () => {
    renderWithRouter(<Layout />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  test('component exports correctly', () => {
    expect(Layout).toBeDefined();
    expect(typeof Layout).toBe('function');
  });
});