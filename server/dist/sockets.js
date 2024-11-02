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
    io.on('connection', (socket) => {
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
        socket.on('collaboratorJoined', (collaborator) => {
            socket.broadcast.emit('collaboratorJoined', collaborator);
        });
        socket.on('collaboratorMoved', (collaboratorMove) => {
            socket.broadcast.emit('collaboratorMoved', collaboratorMove);
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
// io.listen(PORT)
// console.log(`Sockets listening on port ${PORT}`)
