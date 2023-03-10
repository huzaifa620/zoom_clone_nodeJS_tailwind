const express = require('express');
const { v4: uuidv4} = require('uuid');
const { ExpressPeerServer } = require('peer');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)
const peerServer = ExpressPeerServer(server, {debug: true})

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use('/peerjs', peerServer)

app.get('/', (req, res) => {
    res.status(200).redirect(`/${uuidv4()}`)
})

app.get('/:romm', (req, res) => {
    res.status(200).render('room', { roomId: req.params.room })
})

io.on('connection', (socket) => {
        
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId);
        socket.on('message', (message) => {
            io.to(roomId).emit('createMessage', message)
        })
    })

    socket.on('disconnect', () => {
        socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
    
})

server.listen(process.env.PORT || 3000)