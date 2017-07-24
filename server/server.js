const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString } = require('./utils/validator');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    console.log('new user connected');
    
    socket.on('join', (params, callback)=>{
        if(!isRealString(params.name) || !isRealString(params.roomname)){
           return callback('Name and Room name required');
        };

        socket.join(params.roomname);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.roomname);

        io.to(params.roomname).emit('updateUserList', users.getUserList(params.roomname));

        socket.emit('newMessage',generateMessage('Admin', 'Welcome to chat app'));
        socket.broadcast.to(params.roomname).emit('newMessage',generateMessage('Admin', `${params.name} has joined`));


        callback();
    }); 

    socket.on('createMessage', (message, callbacks)=>{
        console.log('createMessage:', message);

        
        //io.emit for sending message to every connected users unlike socket.emit
        //broadcasting is emitting the message to everybody but one specific user

        io.emit('newMessage',generateMessage(message.from, message.text));
        callbacks();

        // socket.broadcast.emit('newMessage',{
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        //  });
    });

    socket.on('createLocationMessage', (coords)=>{
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', ()=>{
       // console.log('User was disconnected');
       var user = users.removeUser(socket.id);

       if(user){
           io.to(user.roomname).emit('updateUserList', users.getUserList(user.roomname));
           io.to(user.roomname).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
       }
    });
});

server.listen(port, () => {
    console.log(`Started up at port ${port}`);
});



