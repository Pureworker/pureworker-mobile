import {io} from 'socket.io-client';

// const socket = new io('https://creatbase-dev.onrender.com', {
//   autoConnect: true,
//   withCredentials: true,
// });https://pureworker.onrender.com
// const socket = io('https://api.pureworker.com', {
//   autoConnect: false,
// });https://pureworker-3482.onrender.com
const socket = io('https://pureworker-api.onrender.com', {
  autoConnect: false,
});


export default socket;
