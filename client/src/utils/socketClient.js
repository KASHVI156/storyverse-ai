import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || window.location.origin;

export function createStorySocket(token) {
  return io(SOCKET_URL, {
    path: '/socket.io',
    auth: { token },
    withCredentials: true,
    transports: ['websocket', 'polling'],
  });
}
