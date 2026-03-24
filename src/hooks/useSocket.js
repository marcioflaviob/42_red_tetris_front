import { useCallback, useEffect, useRef } from 'react';
import { useAppSelector } from '../store/hooks';
import { socketService } from '../services/SocketService';

const useSocket = () => {
  const user = useAppSelector((state) => state.user);
  const socketRef = useRef(null);

  useEffect(() => {
    if (user.sessionId && !socketRef.current) {
      socketRef.current = socketService.connect(user.sessionId, user.username);
    }

    return () => {
      // Keep connection alive
      // socketService.disconnect();
    };
  }, [user.sessionId, user.username]);

  // Stable references — socketService is a singleton so these never need to change
  const emit = useCallback((event, data) => {
    socketService.emit(event, data);
  }, []);

  const on = useCallback((event, callback) => {
    socketService.on(event, callback);
  }, []);

  const off = useCallback((event, callback) => {
    socketService.off(event, callback);
  }, []);

  return {
    socket: socketRef.current,
    emit,
    on,
    off,
    isConnected: socketService.isConnected,
  };
};

export default useSocket;
