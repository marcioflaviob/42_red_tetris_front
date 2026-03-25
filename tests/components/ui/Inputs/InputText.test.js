import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InputText from '../../../../src/components/ui/Inputs/InputText';

describe('InputText Component', () => {
  it('renders correctly', () => {
    render(<InputText value='test-user' onChange={() => {}} />);
    expect(screen.getByDisplayValue('test-user')).toBeInTheDocument();
  });

  it('calls onChange when typing', () => {
    const handleChange = jest.fn();
    render(<InputText value='' onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new-val' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('applies resizable class when prop is true', () => {
    const { container } = render(<InputText resizable={true} value='' onChange={() => {}} />);
    expect(container.firstChild).toHaveClass('resizable');
  });

  it('handles focus by moving cursor to end', () => {
    render(<InputText value='hello' onChange={() => {}} />);
    const input = screen.getByRole('textbox');
    
    // Using Object.defineProperty since simply passing it to fireEvent might not override existing props
    Object.defineProperty(input, 'selectionStart', { writable: true, value: 0 });
    Object.defineProperty(input, 'selectionEnd', { writable: true, value: 0 });
    
    fireEvent.focus(input);
    
    expect(input.selectionStart).toBe(5);
    expect(input.selectionEnd).toBe(5);
  });
});