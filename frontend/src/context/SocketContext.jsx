import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);

      newSocket.emit('setup', user.id);

      newSocket.on('user_status', ({ userId, status }) => {
        setOnlineUsers((prev) => {
          if (status === 'online') return [...new Set([...prev, userId])];
          return prev.filter((id) => id !== userId);
        });
      });

      return () => newSocket.disconnect();
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
