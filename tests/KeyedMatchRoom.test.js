import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { KeyedMatchRoom } from '../src/KeyedMatchRoom';

// We mock MatchRoom because we only want to test that KeyedMatchRoom 
// renders it and passes the key correctly.
jest.mock('../src/pages/MatchRoom', () => {
    return function MockMatchRoom() {
        return <div data-testid="match-room-mock">Match Room</div>;
    };
});

describe('KeyedMatchRoom Component', () => {
    test('renders MatchRoom with the roomId from params', () => {
        const { getByTestId } = render(
            <MemoryRouter initialEntries={['/room/test-room-id']}>
                <Routes>
                    <Route path="/room/:roomId" element={<KeyedMatchRoom />} />
                </Routes>
            </MemoryRouter>
        );

        expect(getByTestId('match-room-mock')).toBeInTheDocument();
    });
});