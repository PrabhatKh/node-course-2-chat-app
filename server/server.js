const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    console.log('new user connected');
    socket.emit('newMessage',generateMessage('Admin', 'Welcome to chat app'));

    socket.broadcast.emit('newMessage',generateMessage('Admin', 'New user joined'));

    socket.on('createMessage', (message, callbacks)=>{
        console.log('createMessage:', message);

        
        //io.emit for sending message to every connected users unlike socket.emit
        //broadcasting is emitting the message to everybody but one specific user

        io.emit('newMessage',generateMessage(message.from, message.text));
        callbacks('This is from the server.');

        // socket.broadcast.emit('newMessage',{
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        //  });
    });

    socket.on('disconnect', ()=>{
        console.log('User was disconnected');
    });
});

server.listen(port, () => {
    console.log(`Started up at port ${port}`);
});



