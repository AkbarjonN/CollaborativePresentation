import { io } from 'socket.io-client';
let socket;
export const initSocket = () => {
  if (!socket) {
    socket = io('https://collaborativepresentation.onrender.com'); 
  }
  return socket;
}; 