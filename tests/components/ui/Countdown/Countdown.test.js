import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Countdown from '../../../../src/components/ui/Countdown/Countdown';

describe('Countdown Component', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        act(() => {
            jest.runOnlyPendingTimers();
        });
        jest.useRealTimers();
    });

    test('renders nothing when isVisible is false', () => {
        const { container } = render(<Countdown isVisible={false} />);
        expect(container.firstChild).toBeNull();
    });

    test('starts at 3 and counts down to GO!', () => {
        render(<Countdown isVisible={true} onComplete={jest.fn()} />);

        expect(screen.getByText('3')).toBeInTheDocument();

        act(() => { jest.advanceTimersByTime(1000); });
        expect(screen.getByText('2')).toBeInTheDocument();

        act(() => { jest.advanceTimersByTime(1000); });
        expect(screen.getByText('1')).toBeInTheDocument();

        act(() => { jest.advanceTimersByTime(1000); });
        expect(screen.getByText('GO!')).toBeInTheDocument();
    });

    test('resets state when isVisible toggles from true to false', () => {
        const { rerender } = render(<Countdown isVisible={true} />);

        act(() => { jest.advanceTimersByTime(1000); });
        expect(screen.getByText('2')).toBeInTheDocument();

        rerender(<Countdown isVisible={false} />);
        expect(screen.queryByText('2')).not.toBeInTheDocument();
    });
});