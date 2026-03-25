import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// 1. Polyfill missing browser APIs for React Router / JSDOM
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// 2. Fix the "global is not defined" error
if (typeof global === 'undefined') {
    window.global = window;
}

// 3. Mock Vite's environment variables safely
global.process = global.process || {};
global.process.env = {
    ...global.process.env,
    VITE_BACKEND_URL: 'http://localhost:3000',
};

// 4. Mock Web Audio API (Essential for useAudioManager)
window.AudioContext = window.AudioContext || window.webkitAudioContext || jest.fn().mockImplementation(() => ({
    decodeAudioData: jest.fn().mockResolvedValue({ duration: 10 }),
    createBufferSource: jest.fn().mockReturnValue({
        connect: jest.fn(),
        start: jest.fn(),
        stop: jest.fn(),
        buffer: null,
        loop: false,
        onended: null,
    }),
    resume: jest.fn().mockResolvedValue(),
    close: jest.fn().mockResolvedValue(),
    currentTime: 0,
    destination: {},
    state: 'suspended',
}));

// 5. Mock fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
        json: () => Promise.resolve({}),
    })
);