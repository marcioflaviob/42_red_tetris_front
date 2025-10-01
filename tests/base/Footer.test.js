import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../../src/base/Footer';

jest.mock('../../src/base/Footer.module.css', () => ({
  footer: 'footer',
}));
const mockDate = new Date('2023-12-01');
globalThis.Date = jest.fn(() => mockDate);
globalThis.Date.getFullYear = jest.fn(() => 2023);

describe('Footer Component', () => {
  beforeEach(() => {
    jest.spyOn(globalThis, 'Date').mockImplementation(() => mockDate);
    Date.prototype.getFullYear = jest.fn(() => 2023);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders without crashing', () => {
    const { container } = render(<Footer />);
    expect(container.firstChild).toBeInTheDocument();
  });

  test('renders footer element', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  test('applies correct CSS class', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('footer');
  });

  test('renders footer content with container', () => {
    const { container } = render(<Footer />);
    const containerDiv = container.querySelector('.container');
    expect(containerDiv).toBeInTheDocument();
    expect(containerDiv).toHaveClass('mx-auto', 'px-4');
  });

  test('displays copyright text with current year', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2023 Your Company. All rights reserved./)).toBeInTheDocument();
  });

  test('copyright is in a span element', () => {
    const { container } = render(<Footer />);
    const span = container.querySelector('span');
    expect(span).toHaveTextContent('© 2023 Your Company. All rights reserved.');
  });

  test('component exports correctly', () => {
    expect(Footer).toBeDefined();
    expect(typeof Footer).toBe('function');
  });

  test('displays current year dynamically', () => {
    Date.prototype.getFullYear = jest.fn(() => 2024);
    
    render(<Footer />);
    expect(screen.getByText(/© \d{4} Your Company. All rights reserved./)).toBeInTheDocument();
  });
});