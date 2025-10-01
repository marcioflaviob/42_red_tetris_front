import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Title from '../../../../src/components/ui/Titles/Title';

// Mock CSS modules
jest.mock('../../../../src/components/ui/Titles/Title.module.css', () => ({
  title: 'title',
}));

describe('Title Component', () => {
  test('renders children correctly', () => {
    const titleText = 'Test Title';
    render(<Title>{titleText}</Title>);
    expect(screen.getByText(titleText)).toBeInTheDocument();
  });

  test('renders as h2 element', () => {
    render(<Title>Test Title</Title>);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Test Title');
  });

  test('applies default CSS class', () => {
    render(<Title>Test Title</Title>);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveClass('title');
  });

  test('applies className prop correctly', () => {
    const customClass = 'custom-title';
    render(<Title className={customClass}>Test Title</Title>);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveClass('title', customClass);
  });

  test('className defaults to empty string', () => {
    render(<Title>Test Title</Title>);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveClass('title');
  });

  test('handles multiple children', () => {
    render(
      <Title>
        <span>Part 1</span>
        <span>Part 2</span>
      </Title>
    );
    expect(screen.getByText('Part 1')).toBeInTheDocument();
    expect(screen.getByText('Part 2')).toBeInTheDocument();
  });

  test('handles complex children', () => {
    render(
      <Title>
        Main Title
        <small> - subtitle</small>
      </Title>
    );
    expect(screen.getByText('Main Title')).toBeInTheDocument();
    expect(screen.getByText('- subtitle')).toBeInTheDocument();
  });

  test('handles numeric children', () => {
    render(<Title>{42}</Title>);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  test('component exports correctly', () => {
    expect(Title).toBeDefined();
    expect(typeof Title).toBe('function');
  });

  test('applies multiple custom classes correctly', () => {
    const customClasses = 'custom-title another-class';
    render(<Title className={customClasses}>Test Title</Title>);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveClass('title', 'custom-title', 'another-class');
  });

  test('renders empty string children', () => {
    render(<Title>{''}</Title>);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('');
  });

  test('renders with no children', () => {
    render(<Title />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
  });
});