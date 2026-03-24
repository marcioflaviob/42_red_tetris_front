import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(sessionId, username) {
    if (this.socket) {
      return this.socket;
    }

    this.socket = io(import.meta.env.VITE_BACKEND_URL, {
      auth: {
        sessionId,
        username,
      },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to server:', this.socket.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('error', (error) => {
      console.error('Connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected');
    }
  }

  on(event, callback) {
    if (this.socket) {
      console.log(`[Socket] Registering listener for event: ${event}`);
      this.socket.on(event, callback);
    } else {
      console.warn(`[Socket] Cannot register listener for ${event}: socket not initialized`);
    }
  }

  off(event, callback) {
    if (this.socket) {
      console.log(`[Socket] Removing listener for event: ${event}`);
      this.socket.off(event, callback);
    }
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();
