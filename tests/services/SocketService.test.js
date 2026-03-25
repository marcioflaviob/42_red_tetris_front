import { socketService } from '../../src/services/SocketService';
import { io } from 'socket.io-client';

jest.mock('socket.io-client', () => {
    const mSocket = {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
        disconnect: jest.fn(),
        id: 'socket-id',
        connected: true,
    };
    return {
        io: jest.fn(() => mSocket)
    };
});

describe('SocketService', () => {
    beforeEach(() => {
        socketService.disconnect();
        jest.clearAllMocks();
    });

    it('connect initializes a socket and sets up listeners', () => {
        const socket = socketService.connect('sid', 'user');
        expect(socket.on).toHaveBeenCalledWith('connect', expect.any(Function));
        expect(socketService.getSocket()).toBe(socket);
    });

    it('connect returns existing socket if already connected', () => {
        const socket1 = socketService.connect('sid', 'user');
        const socket2 = socketService.connect('sid2', 'user2');
        expect(socket1).toBe(socket2);
    });

    it('disconnect cleans up socket', () => {
        socketService.connect('sid', 'user');
        socketService.disconnect();
        expect(socketService.getSocket()).toBeNull();
    });

    it('emit sends event if connected', () => {
        socketService.connect('sid', 'user');
        socketService.emit('test_event', { data: 1 });
        const sock = socketService.getSocket();
        expect(sock.emit).toHaveBeenCalledWith('test_event', { data: 1 });
    });

    it('on registers callback if connected', () => {
        const fn = jest.fn();
        socketService.connect('sid', 'user');
        socketService.on('custom', fn);
        const sock = socketService.getSocket();
        expect(sock.on).toHaveBeenCalledWith('custom', fn);
    });

    it('off removes callback if connected', () => {
        const fn = jest.fn();
        socketService.connect('sid', 'user');
        socketService.off('custom', fn);
        const sock = socketService.getSocket();
        expect(sock.off).toHaveBeenCalledWith('custom', fn);
    });
});