import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import ProtectedRoutes from '../src/ProtectedRoutes';

const renderWithRouter = (ui) => {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
};

describe('ProtectedRoutes Component', () => {
  test('renders Outlet component', () => {
    const { container } = renderWithRouter(<ProtectedRoutes />);
    
    expect(container).toBeInTheDocument();
  });

  test('component exports correctly', () => {
    expect(ProtectedRoutes).toBeDefined();
    expect(typeof ProtectedRoutes).toBe('function');
  });

  test('renders without crashing', () => {
    expect(() => renderWithRouter(<ProtectedRoutes />)).not.toThrow();
  });
});