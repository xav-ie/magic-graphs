"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sockets = void 0;
const socket_io_1 = require("socket.io");
const sockets = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: '*',
        },
    });
    const collaboratorIdToCollaborator = new Map();
    io.on('connection', (socket) => {
        socket.on('joinRoom', (joinRoomDetails) => {
            socket.join(joinRoomDetails.roomId);
            collaboratorIdToCollaborator.set(socket.id, joinRoomDetails);
            socket.broadcast.to(joinRoomDetails.roomId).emit('collaboratorJoined', joinRoomDetails);
        });
        socket.on('nodeAdded', (node) => {
            socket.broadcast.emit('nodeAdded', node);
        });
        socket.on('nodeRemoved', (node) => {
            socket.broadcast.emit('nodeRemoved', node);
        });
        socket.on('nodeMoved', (node) => {
            socket.broadcast.emit('nodeMoved', node);
        });
        socket.on('edgeAdded', (edge) => {
            socket.broadcast.emit('edgeAdded', edge);
        });
        socket.on('edgeRemoved', (edge) => {
            socket.broadcast.emit('edgeRemoved', edge);
        });
        socket.on('toServerCollaboratorMoved', ({ x, y }) => {
            socket.broadcast.emit('toClientCollaboratorMoved', {
                id: socket.id,
                x,
                y,
            });
        });
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
        socket.on('error', (error) => {
            console.error(error);
        });
    });
    return io;
};
exports.sockets = sockets;
