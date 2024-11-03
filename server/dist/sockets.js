"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sockets = void 0;
const socket_io_1 = require("socket.io");
const trackGraphState_1 = require("./trackGraphState");
const sockets = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: '*',
        },
    });
    /**
     * a map of collaborator ids to their details and the room they are in
     */
    const collaboratorIdToCollaborator = {};
    io.on('connection', (socket) => {
        const tracker = (0, trackGraphState_1.trackGraphState)();
        socket.on('joinRoom', async (joinRoomDetails, initialGraphState, callback) => {
            tracker.setRoomId(joinRoomDetails.roomId);
            socket.join(tracker.getRoomId());
            socket.broadcast.to(tracker.getRoomId()).emit('collaboratorJoined', joinRoomDetails);
            const graphState = tracker.getGraphState();
            if (!graphState && initialGraphState)
                tracker.setGraphState(initialGraphState);
            else if (!graphState)
                tracker.setGraphState({ nodes: [], edges: [] });
            collaboratorIdToCollaborator[socket.id] = joinRoomDetails;
            callback(collaboratorIdToCollaborator, tracker.getGraphState());
        });
        socket.on('leaveRoom', (confirmationCallback) => {
            socket.leave(tracker.getRoomId());
            socket.broadcast.to(tracker.getRoomId()).emit('collaboratorLeft', socket.id);
            delete collaboratorIdToCollaborator[socket.id];
            confirmationCallback();
        });
        socket.on('nodeAdded', (node) => {
            tracker.addNode(node);
            socket.broadcast.to(tracker.getRoomId()).emit('nodeAdded', node);
        });
        socket.on('nodeRemoved', (nodeId) => {
            tracker.removeNode(nodeId);
            socket.broadcast.to(tracker.getRoomId()).emit('nodeRemoved', nodeId);
        });
        socket.on('nodeMoved', (node) => {
            tracker.updateNode(node.id, node);
            socket.broadcast.to(tracker.getRoomId()).emit('nodeMoved', node);
        });
        socket.on('edgeAdded', (edge) => {
            tracker.addEdge(edge);
            socket.broadcast.to(tracker.getRoomId()).emit('edgeAdded', edge);
        });
        socket.on('edgeRemoved', (edgeId) => {
            tracker.removeEdge(edgeId);
            socket.broadcast.to(tracker.getRoomId()).emit('edgeRemoved', edgeId);
        });
        socket.on('edgeWeightEdited', (edgeId, newWeight) => {
            tracker.updateEdge(edgeId, { weight: newWeight });
            socket.broadcast.to(tracker.getRoomId()).emit('edgeWeightEdited', edgeId, newWeight);
        });
        socket.on('toServerCollaboratorMoved', ({ x, y }) => {
            const roomId = collaboratorIdToCollaborator[socket.id]?.roomId;
            if (!roomId)
                return;
            socket.broadcast.to(roomId).emit('toClientCollaboratorMoved', { id: socket.id, x, y });
        });
        socket.on('disconnect', () => {
            const collaborator = collaboratorIdToCollaborator[socket.id];
            if (!collaborator)
                return;
            socket.broadcast.to(collaborator.roomId).emit('collaboratorLeft', socket.id);
            delete collaboratorIdToCollaborator[socket.id];
        });
        socket.on('error', (error) => {
            console.error(error);
        });
    });
    return io;
};
exports.sockets = sockets;
