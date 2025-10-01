import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorPage from '../../src/pages/ErrorPage';

describe('ErrorPage Component', () => {
  test('renders without crashing', () => {
    render(<ErrorPage />);
    expect(document.body).toBeInTheDocument();
  });

  test('displays error heading', () => {
    render(<ErrorPage />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Oops! Something went wrong.');
  });

  test('displays error message', () => {
    render(<ErrorPage />);
    const message = screen.getByText('The page you are looking for does not exist or an error has occurred.');
    expect(message).toBeInTheDocument();
  });

  test('applies correct inline styles', () => {
    const { container } = render(<ErrorPage />);
    const divElement = container.firstChild;
    expect(divElement).toHaveStyle({
      textAlign: 'center',
      marginTop: '10vh',
    });
  });

  test('message is in a paragraph element', () => {
    render(<ErrorPage />);
    const paragraph = screen.getByText('The page you are looking for does not exist or an error has occurred.');
    expect(paragraph.tagName).toBe('P');
  });

  test('component exports correctly', () => {
    expect(ErrorPage).toBeDefined();
    expect(typeof ErrorPage).toBe('function');
  });

  test('component structure is correct', () => {
    const { container } = render(<ErrorPage />);
    const divElement = container.firstChild;
    expect(divElement.tagName).toBe('DIV');
    
    const heading = divElement.querySelector('h1');
    const paragraph = divElement.querySelector('p');
    
    expect(heading).toBeInTheDocument();
    expect(paragraph).toBeInTheDocument();
  });
});