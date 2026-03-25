import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { socketService } from '../services/SocketService';

const useSocket = () => {
  const user = useAppSelector((state) => state.user);
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(socketService.isConnected);

  useEffect(() => {
    if (!user.sessionId) return;

    const socket = socketService.connect(user.sessionId, user.username);
    socketRef.current = socket;

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // Sync immediately in case the socket is already connected or disconnected
    setIsConnected(socket.connected);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
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
    isConnected,
  };
};

export default useSocket;
