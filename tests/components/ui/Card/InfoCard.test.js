import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InfoCard from '../../../../src/components/ui/Card/InfoCard';

// Mock CSS modules
jest.mock('../../../../src/components/ui/Card/InfoCard.module.css', () => ({
  card: 'info-card',
}));

describe('InfoCard Component', () => {
  test('renders children correctly', () => {
    const testContent = 'Info Content';
    render(<InfoCard>{testContent}</InfoCard>);
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  test('applies className prop correctly', () => {
    const testClass = 'info-test-class';
    const { container } = render(<InfoCard className={testClass}>Content</InfoCard>);
    expect(container.firstChild).toHaveClass('info-card', testClass);
  });

  test('renders without className', () => {
    const { container } = render(<InfoCard>Content</InfoCard>);
    expect(container.firstChild).toHaveClass('info-card');
    expect(container.firstChild).toBeInTheDocument();
  });

  test('handles multiple children', () => {
    render(
      <InfoCard>
        <div>Child 1</div>
        <div>Child 2</div>
      </InfoCard>
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  test('className defaults to empty string', () => {
    const { container } = render(<InfoCard>Content</InfoCard>);
    expect(container.firstChild).toHaveClass('info-card');
  });

  test('renders as div element', () => {
    const { container } = render(<InfoCard>Content</InfoCard>);
    expect(container.firstChild.tagName).toBe('DIV');
  });

  test('component exports correctly', () => {
    expect(InfoCard).toBeDefined();
    expect(typeof InfoCard).toBe('function');
  });

  test('handles complex children', () => {
    render(
      <InfoCard>
        <h2>Title</h2>
        <p>Description</p>
        <button>Action</button>
      </InfoCard>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });
});