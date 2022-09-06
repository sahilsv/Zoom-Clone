// const { PeerServer } = require('peer');

const socket  = io('/');

const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

// we have mentioned 'undefined' in place of ID coz peerJS automatically creates an ID for us
var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3030'
})

let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
})

// listen on the peer connection
peer.on('open', id => {
    // the person(self) has joined the room using that 'id'
    socket.emit('join-room', ROOM_ID, id);
})

// We can join the room using the specific room ID


socket.on('user-connected', (userId) => {
    connectToNewUser(userId);
})

const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream; // Loads the data for the particular stream
    // Upon loading the stream, we want to play the video
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.appendChild(video);
}

