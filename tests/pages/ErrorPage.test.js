import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ErrorPage from '../../src/pages/ErrorPage';

// Mock sub-components to keep the test focused and fast
jest.mock('../../src/components/ui/Backgrounds/HomePageBg', () => () => <div data-testid="bg" />);
jest.mock('../../src/components/ui/Card/Card', () => ({ children, className }) => <div className={className}>{children}</div>);

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

const renderErrorPage = (state = null) => {
    return render(
        <MemoryRouter initialEntries={[{ pathname: '/error', state }]}>
            <Routes>
                <Route path="/error" element={<ErrorPage />} />
            </Routes>
        </MemoryRouter>
    );
};

describe('ErrorPage Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders default error message when no state is provided', () => {
        renderErrorPage(null);

        expect(screen.getByText(/Oops! Something went wrong/i)).toBeInTheDocument();
        expect(screen.getByText(/The page you are looking for does not exist/i)).toBeInTheDocument();
    });

    test('renders specific error message when error state is provided', () => {
        const customError = { error: { data: { error: 'Custom Server Error Message' } } };
        renderErrorPage(customError);

        expect(screen.getByText('Custom Server Error Message')).toBeInTheDocument();
    });

    test('navigates to home when "Go Back Home" button is clicked', () => {
        renderErrorPage(null);

        const button = screen.getByRole('button', { name: /go back home/i });
        fireEvent.click(button);

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('renders the error animation image', () => {
        renderErrorPage(null);
        const img = screen.getByAltText(/Error glitch animation/i);
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', '/others/error.gif');
    });
});