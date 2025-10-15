import { useEffect, useRef } from 'react';
import { useAppSelector } from '../store/hooks';
import { socketService } from '../services/SocketService';

const useSocket = () => {
  const user = useAppSelector(state => state.user);
  const socketRef = useRef(null);

  useEffect(() => {
    if (user.sessionId && !socketRef.current) {
      socketRef.current = socketService.connect(user.sessionId, user.username);
    }

    return () => {
      // Keep connection alive
      // socketService.disconnect();
    };
  }, [user.sessionId]);

  const emit = (event, data) => {
    socketService.emit(event, data);
  };

  const on = (event, callback) => {
    socketService.on(event, callback);
  };

  const off = (event, callback) => {
    socketService.off(event, callback);
  };

  return {
    socket: socketRef.current,
    emit,
    on,
    off,
    isConnected: socketService.isConnected
  };
};

export default useSocket;