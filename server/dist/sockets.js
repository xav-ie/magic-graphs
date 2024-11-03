"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sockets = void 0;
const socket_io_1 = require("socket.io");
const sockets = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });
    /**
     * a map of collaborator ids to their details and the room they are in
     */
    const collaboratorIdToCollaborator = {};
    const updateEdge = (roomId, edgeId, edge) => {
        const graphState = roomIdToGraphState[roomId];
        if (!graphState)
            return;
        const edgeIndex = graphState.edges.findIndex((e) => e.id === edgeId);
        if (edgeIndex === -1)
            return;
        graphState.edges[edgeIndex] = {
            ...graphState.edges[edgeIndex],
            ...edge
        };
    };
    const updateNode = (roomId, nodeId, node) => {
        const graphState = roomIdToGraphState[roomId];
        if (!graphState)
            return;
        const nodeIndex = graphState.nodes.findIndex((n) => n.id === nodeId);
        if (nodeIndex === -1)
            return;
        graphState.nodes[nodeIndex] = {
            ...graphState.nodes[nodeIndex],
            ...node
        };
    };
    const removeEdge = (roomId, edgeId) => {
        const graphState = roomIdToGraphState[roomId];
        if (!graphState)
            return;
        graphState.edges = graphState.edges.filter((e) => e.id !== edgeId);
    };
    const removeNode = (roomId, nodeId) => {
        const graphState = roomIdToGraphState[roomId];
        if (!graphState)
            return;
        graphState.nodes = graphState.nodes.filter((n) => n.id !== nodeId);
    };
    const addEdge = (roomId, edge) => {
        const graphState = roomIdToGraphState[roomId];
        if (!graphState)
            return;
        graphState.edges.push(edge);
    };
    const addNode = (roomId, node) => {
        const graphState = roomIdToGraphState[roomId];
        if (!graphState)
            return;
        graphState.nodes.push(node);
    };
    io.on('connection', (socket) => {
        socket.on('joinRoom', async (joinRoomDetails, callback) => {
            socket.join(joinRoomDetails.roomId);
            socket.broadcast.to(joinRoomDetails.roomId).emit('collaboratorJoined', joinRoomDetails);
            const graphState = roomIdToGraphState[joinRoomDetails.roomId];
            if (!graphState) {
                roomIdToGraphState[joinRoomDetails.roomId] = {
                    nodes: [],
                    edges: []
                };
            }
            collaboratorIdToCollaborator[socket.id] = joinRoomDetails;
            callback(collaboratorIdToCollaborator, graphState);
        });
        socket.on('leaveRoom', (roomId, confirmationCallback) => {
            socket.leave(roomId);
            socket.broadcast.to(roomId).emit('collaboratorLeft', socket.id);
            delete collaboratorIdToCollaborator[socket.id];
            confirmationCallback();
        });
        socket.on('nodeAdded', (node) => {
            const roomId = collaboratorIdToCollaborator[socket.id]?.roomId;
            if (!roomId)
                return;
            addNode(roomId, node);
            socket.broadcast.to(roomId).emit('nodeAdded', node);
        });
        socket.on('nodeRemoved', (nodeId) => {
            const roomId = collaboratorIdToCollaborator[socket.id]?.roomId;
            if (!roomId)
                return;
            removeNode(roomId, nodeId);
            socket.broadcast.to(roomId).emit('nodeRemoved', nodeId);
        });
        socket.on('nodeMoved', (node) => {
            const roomId = collaboratorIdToCollaborator[socket.id]?.roomId;
            if (!roomId)
                return;
            updateNode(roomId, node.id, node);
            socket.broadcast.to(roomId).emit('nodeMoved', node);
        });
        socket.on('edgeAdded', (edge) => {
            const roomId = collaboratorIdToCollaborator[socket.id]?.roomId;
            if (!roomId)
                return;
            addEdge(roomId, edge);
            socket.broadcast.to(roomId).emit('edgeAdded', edge);
        });
        socket.on('edgeRemoved', (edgeId) => {
            const roomId = collaboratorIdToCollaborator[socket.id]?.roomId;
            if (!roomId)
                return;
            removeEdge(roomId, edgeId);
            socket.broadcast.to(roomId).emit('edgeRemoved', edgeId);
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
