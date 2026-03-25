import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoutes from '../src/ProtectedRoutes';

/**
 * Helper component to verify current location
 */
const LocationDisplay = () => {
    const location = useLocation();
    return <div data-testid="location-display">{location.pathname}</div>;
};

const renderWithRouter = (initialPath) => {
    return render(
        <MemoryRouter initialEntries={[initialPath]}>
            <Routes>
                <Route path="/error" element={<div>Error Page<LocationDisplay /></div>} />
                <Route element={<ProtectedRoutes />}>
                    <Route path="/:roomId" element={<div>Room Content<LocationDisplay /></div>} />
                    <Route path="/" element={<div>Root Content<LocationDisplay /></div>} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
};

describe('ProtectedRoutes', () => {
    test('allows access when roomId matches the pattern (word-word)', () => {
        renderWithRouter('/funny-tetris');

        // Should render the child route content
        expect(screen.getByText(/Room Content/i)).toBeInTheDocument();
        expect(screen.getByTestId('location-display')).toHaveTextContent('/funny-tetris');
    });

    test('redirects to /error when roomId format is invalid', () => {
        renderWithRouter('/invalid_room_123');

        // Should NOT show room content
        expect(screen.queryByText(/Room Content/i)).not.toBeInTheDocument();

        // Should show error page content due to Navigate
        expect(screen.getByText(/Error Page/i)).toBeInTheDocument();
        expect(screen.getByTestId('location-display')).toHaveTextContent('/error');
    });

    test('allows access to root path (no roomId)', () => {
        renderWithRouter('/');

        expect(screen.getByText(/Root Content/i)).toBeInTheDocument();
        expect(screen.getByTestId('location-display')).toHaveTextContent('/');
    });

    test('redirects when roomId contains uppercase letters', () => {
        // The regex /^[a-z]+-[a-z]+$/ is case-sensitive
        renderWithRouter('/Funny-Tetris');

        expect(screen.getByText(/Error Page/i)).toBeInTheDocument();
        expect(screen.getByTestId('location-display')).toHaveTextContent('/error');
    });
});