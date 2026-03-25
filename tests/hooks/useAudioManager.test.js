import { renderHook, act, waitFor } from '@testing-library/react';
import useAudioManager from '../../src/hooks/useAudioManager';

// 1. Mock the Web Audio API
const mockAudioBuffer = { duration: 10 };
const mockSource = {
    connect: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
    buffer: null,
    loop: false,
    onended: null,
};

const mockAudioContext = {
    decodeAudioData: jest.fn().mockResolvedValue(mockAudioBuffer),
    createBufferSource: jest.fn().mockReturnValue(mockSource),
    resume: jest.fn().mockResolvedValue(),
    close: jest.fn().mockResolvedValue(),
    currentTime: 0,
    destination: {},
    state: 'suspended',
};

window.AudioContext = jest.fn().mockImplementation(() => mockAudioContext);

// 2. Mock Fetch for the audio files
global.fetch = jest.fn(() =>
    Promise.resolve({
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
    })
);

describe('useAudioManager', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('should initialize and load audio buffers', async () => {
        const { result } = renderHook(() => useAudioManager());

        // Wait for the async initAudio function to finish loading
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(window.AudioContext).toHaveBeenCalled();
        expect(global.fetch).toHaveBeenCalledTimes(3); // Lobby, Game, Intro
    });

    test('should play lobby music when play is called', async () => {
        const { result } = renderHook(() => useAudioManager());

        // Ensure buffers are loaded first
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        await act(async () => {
            await result.current.play();
        });

        expect(mockAudioContext.createBufferSource).toHaveBeenCalled();
        expect(mockSource.start).toHaveBeenCalled();
        expect(result.current.isPlaying).toBe(true);
    });

    test('should pause/stop current audio', async () => {
        const { result } = renderHook(() => useAudioManager());

        // Ensure buffers are loaded first
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        await act(async () => {
            await result.current.play();
        });

        act(() => {
            result.current.pause();
        });

        expect(mockSource.stop).toHaveBeenCalled();
        expect(result.current.isPlaying).toBe(false);
    });

    test('should handle startGameTransition immediately if not playing', async () => {
        const { result } = renderHook(() => useAudioManager());

        // Ensure buffers are loaded first
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        await act(async () => {
            result.current.startGameTransition();
        });

        // Should trigger createBufferSource for 'game'
        expect(mockAudioContext.createBufferSource).toHaveBeenCalled();
    });

    test('should schedule transition if currently playing', async () => {
        const { result } = renderHook(() => useAudioManager());

        // Ensure buffers are loaded first
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        await act(async () => {
            await result.current.play();
        });

        await act(async () => {
            result.current.startGameTransition();
        });

        // Check if a timeout was set for the transition
        expect(jest.getTimerCount()).toBeGreaterThan(0);
    });

    test('should cleanup on unmount', async () => {
        const { unmount } = renderHook(() => useAudioManager());

        act(() => {
            unmount();
        });

        expect(mockAudioContext.close).toHaveBeenCalled();
    });
});