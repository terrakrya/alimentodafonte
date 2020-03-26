const events = require('events');
const eventEmitter = new events.EventEmitter();
const moment = require('moment');

const debug = process.env.DEBUG_SOCKET || 0;

class MessageService {
    setAdapter(adapter) {
        this.adapter = adapter;
    }
    initSocket(server) {
        this.instantServer = new InstantMessageServer(server);
        eventEmitter.on('onMessage', (content) => this.onMessage(content));
    }
    async onMessage({ room, type, content, userId }) {

        if(!this.adapter) throw 'No adapter configured!';

        await this.adapter.addMessage({
            room,
            type,
            content,
            userId,
        });        
        
    }
    async getRoomMessages(room, threshold) {

        if(!this.adapter) throw 'No adapter configured!';

        const limit = 10; // TODO: config

        return await this.adapter.getRoomMessages(room, threshold, limit);
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