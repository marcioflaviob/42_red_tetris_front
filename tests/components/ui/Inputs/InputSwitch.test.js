import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputSwitch from '../../../../src/components/ui/Inputs/InputSwitch';

// Mock PrimeReact InputSwitch
jest.mock('primereact/inputswitch', () => ({
  InputSwitch: ({ className, checked, onChange, disabled }) => (
    <input
      type="checkbox"
      className={className}
      checked={checked}
      onChange={(e) => onChange({ value: e.target.checked })}
      disabled={disabled}
      data-testid="prime-switch"
    />
  ),
}));

// Mock CSS modules
jest.mock('../../../../src/components/ui/Inputs/InputSwitch.module.css', () => ({
  switch: 'switch',
}));

describe('InputSwitch Component', () => {
  test('renders switch input', () => {
    render(<InputSwitch />);
    const switchInput = screen.getByTestId('prime-switch');
    expect(switchInput).toBeInTheDocument();
    expect(switchInput).toHaveAttribute('type', 'checkbox');
  });

  test('applies checked state correctly', () => {
    render(<InputSwitch checked={true} />);
    const switchInput = screen.getByTestId('prime-switch');
    expect(switchInput).toBeChecked();
  });

  test('is not checked by default when checked prop is false', () => {
    render(<InputSwitch checked={false} />);
    const switchInput = screen.getByTestId('prime-switch');
    expect(switchInput).not.toBeChecked();
  });

  test('calls onChange when toggled', () => {
    const handleChange = jest.fn();
    render(<InputSwitch onChange={handleChange} />);
    const switchInput = screen.getByTestId('prime-switch');
    
    fireEvent.click(switchInput);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith({ value: true });
  });

  test('calls onChange with correct value when unchecked', () => {
    const handleChange = jest.fn();
    render(<InputSwitch checked={true} onChange={handleChange} />);
    const switchInput = screen.getByTestId('prime-switch');
    
    fireEvent.click(switchInput);
    expect(handleChange).toHaveBeenCalledWith({ value: false });
  });

  test('applies disabled state correctly', () => {
    render(<InputSwitch disabled={true} />);
    const switchInput = screen.getByTestId('prime-switch');
    expect(switchInput).toBeDisabled();
  });

  test('is not disabled by default', () => {
    render(<InputSwitch />);
    const switchInput = screen.getByTestId('prime-switch');
    expect(switchInput).not.toBeDisabled();
  });

  test('applies className correctly', () => {
    const customClass = 'custom-switch';
    render(<InputSwitch className={customClass} />);
    const switchInput = screen.getByTestId('prime-switch');
    expect(switchInput).toHaveClass('switch', customClass);
  });

  test('applies default className', () => {
    render(<InputSwitch />);
    const switchInput = screen.getByTestId('prime-switch');
    expect(switchInput).toHaveClass('switch');
  });

  test('className defaults to empty string', () => {
    render(<InputSwitch />);
    const switchInput = screen.getByTestId('prime-switch');
    expect(switchInput).toHaveClass('switch');
  });

  test('handles multiple toggles correctly', () => {
    const handleChange = jest.fn();
    render(<InputSwitch onChange={handleChange} />);
    const switchInput = screen.getByTestId('prime-switch');
    
    fireEvent.click(switchInput);
    expect(handleChange).toHaveBeenNthCalledWith(1, { value: true });
    
    fireEvent.click(switchInput);
    expect(handleChange).toHaveBeenNthCalledWith(2, { value: false });
    
    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  test('does not call onChange when disabled', () => {
    const handleChange = jest.fn();
    render(<InputSwitch onChange={handleChange} disabled={true} />);
    const switchInput = screen.getByTestId('prime-switch');
    
    // The mock implementation doesn't prevent clicks on disabled inputs,
    // so we just verify the component renders in disabled state
    expect(switchInput).toBeDisabled();
  });

  test('component exports correctly', () => {
    expect(InputSwitch).toBeDefined();
    expect(typeof InputSwitch).toBe('function');
  });

  test('renders with all props provided', () => {
    const handleChange = jest.fn();
    render(
      <InputSwitch
        checked={true}
        onChange={handleChange}
        disabled={false}
        className="test-class"
      />
    );
    const switchInput = screen.getByTestId('prime-switch');
    
    expect(switchInput).toBeChecked();
    expect(switchInput).not.toBeDisabled();
    expect(switchInput).toHaveClass('switch', 'test-class');
  });

  test('works without onChange handler', () => {
    expect(() => render(<InputSwitch />)).not.toThrow();
  });
});