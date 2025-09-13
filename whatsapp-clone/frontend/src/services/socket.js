import { io } from 'socket.io-client';

let socket = null;

const getSocket = () => {
  if (!socket || !socket.connected) {
    const token = localStorage.getItem('token');
    
    socket = io('http://localhost:5000', {
      transports: ['websocket'],
      withCredentials: true,
      autoConnect: true,
      // Only send token if it exists
      auth: token ? { token } : {},
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    // Basic event handlers
    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }
  
  return socket;
};

const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export { disconnectSocket };
export default getSocket;