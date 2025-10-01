import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputText from '../../../../src/components/ui/Inputs/InputText';

// Mock PrimeReact InputText  
jest.mock('primereact/inputtext', () => ({
  InputText: jest.fn().mockImplementation(({ className, value, onChange, placeholder, type, name, keyfilter, disabled, id, ...props }, ref) => (
    <input
      ref={ref}
      className={className}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      name={name}
      disabled={disabled}
      id={id}
      data-keyfilter={keyfilter}
      data-testid="prime-input"
      {...props}
    />
  )),
}));

// Mock CSS modules
jest.mock('../../../../src/components/ui/Inputs/InputText.module.css', () => ({
  input: 'input',
}));

describe('InputText Component', () => {
  test('renders input with default props', () => {
    render(<InputText />);
    const input = screen.getByTestId('prime-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('value', '');
  });

  test('applies value prop correctly', () => {
    const testValue = 'test value';
    render(<InputText value={testValue} />);
    const input = screen.getByTestId('prime-input');
    expect(input).toHaveValue(testValue);
  });

  test('calls onChange when input changes', () => {
    const handleChange = jest.fn();
    render(<InputText onChange={handleChange} />);
    const input = screen.getByTestId('prime-input');
    
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('applies placeholder correctly', () => {
    const placeholder = 'Enter text here';
    render(<InputText placeholder={placeholder} />);
    const input = screen.getByTestId('prime-input');
    expect(input).toHaveAttribute('placeholder', placeholder);
  });

  test('applies id correctly', () => {
    const id = 'test-input';
    render(<InputText id={id} />);
    const input = screen.getByTestId('prime-input');
    expect(input).toHaveAttribute('id', id);
  });

  test('applies name correctly', () => {
    const name = 'test-name';
    render(<InputText name={name} />);
    const input = screen.getByTestId('prime-input');
    expect(input).toHaveAttribute('name', name);
  });

  test('applies type correctly', () => {
    const type = 'email';
    render(<InputText type={type} />);
    const input = screen.getByTestId('prime-input');
    expect(input).toHaveAttribute('type', type);
  });

  test('applies keyFilter correctly', () => {
    const keyFilter = 'int';
    render(<InputText keyFilter={keyFilter} />);
    const input = screen.getByTestId('prime-input');
    expect(input).toHaveAttribute('data-keyfilter', keyFilter);
  });

  test('applies disabled state correctly', () => {
    render(<InputText disabled={true} />);
    const input = screen.getByTestId('prime-input');
    expect(input).toBeDisabled();
  });

  test('is not disabled by default', () => {
    render(<InputText />);
    const input = screen.getByTestId('prime-input');
    expect(input).not.toBeDisabled();
  });

  test('applies className correctly', () => {
    const customClass = 'custom-input';
    render(<InputText className={customClass} />);
    const input = screen.getByTestId('prime-input');
    expect(input).toHaveClass('input', customClass);
  });

  test('applies default className', () => {
    render(<InputText />);
    const input = screen.getByTestId('prime-input');
    expect(input).toHaveClass('input');
  });

  test('passes through additional props', () => {
    render(<InputText data-custom="test" autoComplete="off" />);
    const input = screen.getByTestId('prime-input');
    expect(input).toHaveAttribute('data-custom', 'test');
    expect(input).toHaveAttribute('autoComplete', 'off');
  });

  test('ref is forwarded correctly', () => {
    const ref = React.createRef();
    render(<InputText ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  test('handles onKeyDown events', () => {
    const handleKeyDown = jest.fn();
    render(<InputText onKeyDown={handleKeyDown} />);
    const input = screen.getByTestId('prime-input');
    
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  test('handles onBlur events', () => {
    const handleBlur = jest.fn();
    render(<InputText onBlur={handleBlur} />);
    const input = screen.getByTestId('prime-input');
    
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  test('handles onFocus events', () => {
    const handleFocus = jest.fn();
    render(<InputText onFocus={handleFocus} />);
    const input = screen.getByTestId('prime-input');
    
    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  test('component has correct displayName', () => {
    expect(InputText.displayName).toBe('InputText');
  });

  test('component exports correctly', () => {
    expect(InputText).toBeDefined();
    expect(typeof InputText).toBe('object'); // forwardRef returns an object
  });

  test('handles different input types correctly', () => {
    const { rerender } = render(<InputText type="text" />);
    expect(screen.getByTestId('prime-input')).toHaveAttribute('type', 'text');

    rerender(<InputText type="password" />);
    expect(screen.getByTestId('prime-input')).toHaveAttribute('type', 'password');

    rerender(<InputText type="email" />);
    expect(screen.getByTestId('prime-input')).toHaveAttribute('type', 'email');
  });
});