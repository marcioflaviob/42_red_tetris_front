import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../../src/base/Header';

jest.mock('../../src/base/Header.module.css', () => ({
  header: 'header',
}));

describe('Header Component', () => {
  test('renders without crashing', () => {
    const { container } = render(<Header />);
    expect(container.firstChild).toBeInTheDocument();
  });

  test('renders header element', () => {
    render(<Header />);
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  test('applies correct CSS class', () => {
    render(<Header />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('header');
  });

  test('renders header content with container', () => {
    const { container } = render(<Header />);
    const containerDiv = container.querySelector('.container');
    expect(containerDiv).toBeInTheDocument();
    expect(containerDiv).toHaveClass('mx-auto');
  });

  test('displays header text', () => {
    render(<Header />);
    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  test('header text is in h1 element', () => {
    render(<Header />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Header');
  });

  test('component exports correctly', () => {
    expect(Header).toBeDefined();
    expect(typeof Header).toBe('function');
  });
});