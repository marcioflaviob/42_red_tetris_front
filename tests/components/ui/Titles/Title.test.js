import React from 'react';
import { render, screen } from '@testing-library/react';
import Title from '../../../../src/components/ui/Titles/Title';

describe('Title Component', () => {
  it('renders children correctly', () => {
    render(<Title>Tetris</Title>);
    expect(screen.getByText('Tetris')).toBeInTheDocument();
  });

  it('applies custom classes if provided', () => {
    const { container } = render(<Title className="custom-class">Tetris</Title>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});