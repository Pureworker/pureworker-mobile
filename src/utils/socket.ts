import {io} from 'socket.io-client';

// const socket = new io('https://creatbase-dev.onrender.com', {
//   autoConnect: true,
//   withCredentials: true,
// });
const socket = io('https://pureworker.onrender.com', {
  autoConnect: false,
});

export default socket;
