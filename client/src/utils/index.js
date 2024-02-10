import io from 'socket.io-client';

export var socket

export const startSocket = (url)=>{
    socket = io(url);
}