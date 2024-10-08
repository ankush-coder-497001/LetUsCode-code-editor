import { io } from 'socket.io-client';

 export const Socket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };
    return io('https://letuscode-code-editor.onrender.com/', options);
};

