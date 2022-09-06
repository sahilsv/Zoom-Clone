const express = require('express'); // import express
const app = express();
// const server = require('http').Server(app); // create a server
// const io = require('socket.io')(server)

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const {v4:uuidv4} = require('uuid'); // import uuid
// import peerJS and combining with existing express app
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});

app.use(express.static('public')); // if files are not available elsewhere, express looks into the public folder for those files 
app.set('view engine', 'ejs');

// combining with existing express app
app.use('/peerjs', peerServer);

app.get('/', (req, res) => {    
    res.redirect(`/${uuidv4()}`); //uuidv4() fn creates a uuid and it is redirected
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room });
})

io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId); // joined the room on the specific roomId
        socket.broadcast.to(roomId).emit('user-connected', userId);
    })
})



server.listen(3030);