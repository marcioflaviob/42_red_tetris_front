import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Layout from '../src/Layout';

// Mock Footer to isolate Layout
jest.mock('../src/base/Footer', () => () => <footer>Mock Footer</footer>);

describe('Layout Component', () => {
    test('renders main content area and footer', () => {
        render(
            <MemoryRouter>
                <Layout />
            </MemoryRouter>
        );

        expect(screen.getByRole('main')).toBeInTheDocument();
        expect(screen.getByText(/Mock Footer/i)).toBeInTheDocument();
    });
});