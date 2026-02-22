import { io } from "socket.io-client";

let socket = null;

export const connectSocket = () => { // ← remove token param, not needed
  if (socket && socket.connected) return socket;
  if (socket && !socket.connected) {
    socket.connect();
    return socket;
  }

  socket = io(import.meta.env.VITE_API_URL, {
    withCredentials: true, // ← this sends the httpOnly cookie automatically
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};