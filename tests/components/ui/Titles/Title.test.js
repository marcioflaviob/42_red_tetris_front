import { render } from '@testing-library/react';
import Title from '../../../../src/components/ui/Titles/Title';

describe('Title', () => {
    it("title is displayed correctly", () => {
        const { getByText } = render(<Title>Test</Title>);;
        
        const titleElement = getByText('Test');
        expect(titleElement).toBeInTheDocument();
        expect(titleElement.tagName).toBe('H2');
    });

    it("classname is passed correctly", () => {
        const { container, getByText } = render(<Title className="custom-class">Test</Title>);;
        
        const titleElement = container.querySelector('.custom-class');
        expect(titleElement).toBeInTheDocument();
        
        const titleByText = getByText('Test');
        expect(titleByText).toHaveClass('custom-class');
        
        expect(titleByText.className).toContain('custom-class');
    });
});