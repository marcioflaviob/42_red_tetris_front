import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../../../../src/components/ui/Buttons/Button';

// Mock PrimeReact Button
jest.mock('primereact/button', () => ({
  Button: ({ className, onClick, disabled, children, ...props }) => (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      data-testid="prime-button"
      {...props}
    >
      {children}
    </button>
  ),
}));

// Mock CSS modules
jest.mock('../../../../src/components/ui/Buttons/Button.module.css', () => ({
  button: 'button',
  small: 'small',
  normal: 'normal',
  large: 'large',
  primary: 'primary',
  secondary: 'secondary',
  play: 'play',
}));

describe('Button Component', () => {
  test('renders button with text', () => {
    const buttonText = 'Click Me';
    render(<Button>{buttonText}</Button>);
    expect(screen.getByText(buttonText)).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    fireEvent.click(screen.getByTestId('prime-button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies disabled state correctly', () => {
    render(<Button disabled={true}>Disabled Button</Button>);
    const button = screen.getByTestId('prime-button');
    expect(button).toBeDisabled();
  });

  test('is not disabled by default', () => {
    render(<Button>Normal Button</Button>);
    const button = screen.getByTestId('prime-button');
    expect(button).not.toBeDisabled();
  });

  test('applies normal size class by default', () => {
    render(<Button>Normal Button</Button>);
    const button = screen.getByTestId('prime-button');
    expect(button).toHaveClass('button', 'normal', 'primary');
  });

  test('applies small size class correctly', () => {
    render(<Button size="small">Small Button</Button>);
    const button = screen.getByTestId('prime-button');
    expect(button).toHaveClass('button', 'small', 'primary');
  });

  test('applies large size class correctly', () => {
    render(<Button size="large">Large Button</Button>);
    const button = screen.getByTestId('prime-button');
    expect(button).toHaveClass('button', 'large', 'primary');
  });

  test('applies primary variant class by default', () => {
    render(<Button>Primary Button</Button>);
    const button = screen.getByTestId('prime-button');
    expect(button).toHaveClass('button', 'normal', 'primary');
  });

  test('applies secondary variant class correctly', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByTestId('prime-button');
    expect(button).toHaveClass('button', 'normal', 'secondary');
  });

  test('applies play variant class correctly', () => {
    render(<Button variant="play">Play Button</Button>);
    const button = screen.getByTestId('prime-button');
    expect(button).toHaveClass('button', 'normal', 'play');
  });

  test('applies custom className correctly', () => {
    const customClass = 'custom-button';
    render(<Button className={customClass}>Custom Button</Button>);
    const button = screen.getByTestId('prime-button');
    expect(button).toHaveClass('button', 'normal', 'primary', customClass);
  });

  test('passes through additional props', () => {
    render(<Button data-custom="test" id="test-button">Button</Button>);
    const button = screen.getByTestId('prime-button');
    expect(button).toHaveAttribute('data-custom', 'test');
    expect(button).toHaveAttribute('id', 'test-button');
  });

  test('handles all size options correctly', () => {
    const { rerender } = render(<Button size="small">Button</Button>);
    expect(screen.getByTestId('prime-button')).toHaveClass('small');

    rerender(<Button size="normal">Button</Button>);
    expect(screen.getByTestId('prime-button')).toHaveClass('normal');

    rerender(<Button size="large">Button</Button>);
    expect(screen.getByTestId('prime-button')).toHaveClass('large');

    // Test default case
    rerender(<Button size="unknown">Button</Button>);
    expect(screen.getByTestId('prime-button')).toHaveClass('normal');
  });

  test('handles all variant options correctly', () => {
    const { rerender } = render(<Button variant="primary">Button</Button>);
    expect(screen.getByTestId('prime-button')).toHaveClass('primary');

    rerender(<Button variant="secondary">Button</Button>);
    expect(screen.getByTestId('prime-button')).toHaveClass('secondary');

    rerender(<Button variant="play">Button</Button>);
    expect(screen.getByTestId('prime-button')).toHaveClass('play');

    // Test default case
    rerender(<Button variant="unknown">Button</Button>);
    expect(screen.getByTestId('prime-button')).toHaveClass('primary');
  });

  test('getSizeClass returns correct classes', () => {
    // Test through rendered classes since getSizeClass is internal
    const { rerender } = render(<Button size="small">Button</Button>);
    expect(screen.getByTestId('prime-button')).toHaveClass('small');

    rerender(<Button size="large">Button</Button>);
    expect(screen.getByTestId('prime-button')).toHaveClass('large');

    rerender(<Button size="normal">Button</Button>);
    expect(screen.getByTestId('prime-button')).toHaveClass('normal');
  });

  test('getVariantClass returns correct classes', () => {
    // Test through rendered classes since getVariantClass is internal
    const { rerender } = render(<Button variant="secondary">Button</Button>);
    expect(screen.getByTestId('prime-button')).toHaveClass('secondary');

    rerender(<Button variant="play">Button</Button>);
    expect(screen.getByTestId('prime-button')).toHaveClass('play');

    rerender(<Button variant="primary">Button</Button>);
    expect(screen.getByTestId('prime-button')).toHaveClass('primary');
  });

  test('component exports correctly', () => {
    expect(Button).toBeDefined();
    expect(typeof Button).toBe('function');
  });
});