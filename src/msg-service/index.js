const events = require('events');
const eventEmitter = new events.EventEmitter();
const mongoose = require('mongoose');
const Message = mongoose.model('Message');

const moment = require('moment');

const debug = process.env.DEBUG_SOCKET || 0;

class MessageService {
    initSocket(server) {
        this.instantServer = new InstantMessageServer(server);
        eventEmitter.on('onMessage', (content) => this.onMessage(content));
    }
    async onMessage({ room, type, content /*, userId*/ }) {
        // Persistence

        const newMessage = new Message({
            room,
            type,
            content,
            // userId,
        });

        try {
            await newMessage.save();

            return true;
        } catch (err) {
            console.log(err.message);

            return false;
        }
    }
    async getRoomMessages(room, threshold) {

        const limit = 10; // TODO: config

        const filter = { room };

        if(threshold) { // Does it work?
            filter._id = {$lt: mongoose.Types.ObjectId(threshold)};
        }
        
        const messages = await Message.find(filter, null, { limit: limit + 1, sort: { 'createdAt': 'desc' } }).exec();

        messages.reverse();

        let hasMore = false;
        let messageRef = null;
        if (messages.length > 10) {
            messages.shift();
            messageRef = messages[0]._id;
            hasMore = true;
        }

        return {
            messages,
            hasMore,
            messageRef,
        };
    }
}

const socketIo = require('socket.io');

class InstantMessageServer {
    constructor(server) {
        this.io = socketIo(server);
        console.log('Socket.io instantiated');
        this.io.on('connection', (socket) => this.onConnection(socket));

        this.clients = [];
    }

    getClient(id) {
        const client = this.clients.filter(client => client.id === id);

        return client ? client[0] : null;
    }
    removeClient(id) {
        this.clients = this.clients.filter(client => client.id !== id);
    }

    onConnection(socket) {
        this.clients.push({
            id: socket.id,
            rooms: [],
            entering: null,
        });

        this.log(`Client ${socket.id} connected!`);

        socket.on('disconnect', () => this.onSocketDisconnection(socket));
        socket.on('new message', (content) => this.onSocketNewMessage(socket, content));
        socket.on('typing', (content) => this.onSocketTyping(socket, content));
        socket.on('stop typing', (content) => this.onSocketStopTyping(socket, content));
        socket.on('enter room', (content) => this.onSocketEnterRoom(socket, content));
        socket.on('leave room', (content) => this.onSocketLeaveRoom(socket, content));
        socket.on('reconnect rooms', (content) => this.onSocketReconnectRooms(socket, content));
    }

    onSocketDisconnection(socket) {
        this.removeClient(socket.id);
        this.log(`Client ${socket.id} disconnected!`);
    }

    onSocketNewMessage(socket, content) {
        eventEmitter.emit('onMessage', content); // TODO: user data

        socket.to(content.room).emit('new message', content);
    }

    onSocketTyping(socket, content) {
        const { room, name } = content;

        this.log(`Client ${socket.id} (${name}) typing!`);
        socket.to(room).emit('typing', name);
    }
    onSocketStopTyping(socket, content) {
        const { room, name } = content;

        this.log(`Client ${socket.id} (${name}) stop typing!`);
        socket.to(room).emit('stop typing', name);
    }

    onSocketEnterRoom(socket, { roomId }) {
        const client = this.getClient(socket.id);
        if (!client.rooms[roomId]) client.rooms.push(roomId);

        client.entering = moment();
        socket.join(roomId);

        this.log(`Client ${socket.id} entered room ${roomId}!`);
    }
    onSocketLeaveRoom(socket, { roomId }) {
        const client = this.getClient(socket.id);
        client.rooms = client.rooms.filter(room => room !== roomId);

        if (moment().diff(client.entering, 'seconds') < 5) return; // WORKAROUND! TODO: Best practices?

        socket.leave(roomId);

        this.log(`Client ${socket.id} left room ${roomId}!`);
    }
    onSocketReconnectRooms(socket, { rooms }) {
        const client = this.getClient(socket.id);

        rooms.map(roomId => {
            client.rooms.push(roomId);
            socket.join(roomId);
        });

        this.log(`Client ${socket.id} reconnected rooms ${rooms}!`);
    }

    log(message = '') {
        if (debug === 0) return;

        console.log(message, this.clients);
    }
}

const singletonInstance = new MessageService();
module.exports = singletonInstance;