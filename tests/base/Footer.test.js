import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../src/base/Footer';

// Mock LegoPiece since it is imported in the file but not used in the JSX
// This prevents any side effects from the Background component during testing.
jest.mock('../../src/components/ui/Backgrounds/LegoPiece', () => () => <div data-testid="lego-piece" />);

describe('Footer Component', () => {
    test('renders the footer element and its semantic structure', () => {
        render(<Footer />);

        // Check for the semantic footer tag
        const footerElement = screen.getByRole('contentinfo');
        expect(footerElement).toBeInTheDocument();
    });

    test('contains the 42 school logo with correct alt text', () => {
        render(<Footer />);
        const logo = screen.getByAltText('42 Logo');
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('src', 'https://42.fr/wp-content/uploads/2021/05/42-Final-sigle-seul.svg');
    });

    test('renders all external project links', () => {
        render(<Footer />);

        const frontendLink = screen.getByText('frontend');
        const backendLink = screen.getByText('backend');
        const schoolLink = screen.getByText('42 school');

        expect(frontendLink).toHaveAttribute('href', 'https://github.com/marcioflaviob/42_red_tetris_front/');
        expect(backendLink).toHaveAttribute('href', 'https://github.com/marcioflaviob/42_red_tetris_back/');
        expect(schoolLink).toHaveAttribute('href', 'https://42.fr/');
    });

    test('displays the copyright text and author credits', () => {
        render(<Footer />);

        // Check for the main text part
        expect(screen.getByText(/red tetris is a school project written in 2025 by/i)).toBeInTheDocument();

        // Check for author links
        const marcioLink = screen.getByText('marcio flavio');
        const teoLink = screen.getByText('teo rimize');

        expect(marcioLink).toHaveAttribute('href', 'https://www.linkedin.com/in/marcioflavio/');
        expect(teoLink).toHaveAttribute('href', 'https://www.linkedin.com/in/t%C3%A9o-rimize-378b3222a/');
    });

    test('all links have security attributes (target="_blank")', () => {
        render(<Footer />);
        const links = screen.getAllByRole('link');

        links.forEach(link => {
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        });
    });
});