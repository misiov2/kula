const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Nowy użytkownik połączony:', socket.id);

    // Tworzenie pokoju
    socket.on('createRoom', (roomName) => {
        socket.join(roomName);
        console.log(`Pokój ${roomName} został stworzony`);
    });

    // Dołączanie do pokoju
    socket.on('joinRoom', (roomName) => {
        socket.join(roomName);
        console.log(`Użytkownik ${socket.id} dołączył do pokoju ${roomName}`);
    });

    // Dodawanie nowej piłki
    socket.on('addBall', (data) => {
        const roomName = data.roomName;
        io.to(roomName).emit('newBall', data.ballData);
    });
});

server.listen(3000, () => {
    console.log('Serwer działa na porcie 3000');
});
