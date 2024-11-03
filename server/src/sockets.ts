import { Server } from 'socket.io'
import type { Collaborator, GraphEvents } from './graphTypes'
import { createServer } from 'http'
import { trackGraphState } from './trackGraphState'

export const sockets = (httpServer: ReturnType<typeof createServer>) => {
  const io = new Server<GraphEvents, GraphEvents, {}, {}>(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })

  /**
   * a map of collaborator ids to their details and the room they are in
   */
  const collaboratorIdToCollaborator: Record<string, Collaborator & { roomId: string }> = {}


  io.on('connection', (socket) => {

    const tracker = trackGraphState()

    socket.on('joinRoom', async (joinRoomDetails, callback) => {

      tracker.setRoomId(joinRoomDetails.roomId)
      socket.join(joinRoomDetails.roomId)

      socket.broadcast.to(joinRoomDetails.roomId).emit('collaboratorJoined', joinRoomDetails)

      collaboratorIdToCollaborator[socket.id] = joinRoomDetails

      callback(collaboratorIdToCollaborator, tracker.getGraphState())
    })

    socket.on('leaveRoom', (roomId, confirmationCallback) => {
      socket.leave(roomId)
      socket.broadcast.to(roomId).emit('collaboratorLeft', socket.id)

      delete collaboratorIdToCollaborator[socket.id]
      confirmationCallback()
    })

    socket.on('nodeAdded', (node) => {
      const roomId = collaboratorIdToCollaborator[socket.id]?.roomId
      if (!roomId) return
      addNode(roomId, node)
      socket.broadcast.to(roomId).emit('nodeAdded', node)
    })

    socket.on('nodeRemoved', (nodeId) => {
      const roomId = collaboratorIdToCollaborator[socket.id]?.roomId
      if (!roomId) return
      removeNode(roomId, nodeId)
      socket.broadcast.to(roomId).emit('nodeRemoved', nodeId)
    })

    socket.on('nodeMoved', (node) => {
      const roomId = collaboratorIdToCollaborator[socket.id]?.roomId
      if (!roomId) return
      updateNode(roomId, node.id, node)
      socket.broadcast.to(roomId).emit('nodeMoved', node)
    })

    socket.on('edgeAdded', (edge) => {
      const roomId = collaboratorIdToCollaborator[socket.id]?.roomId
      if (!roomId) return
      addEdge(roomId, edge)
      socket.broadcast.to(roomId).emit('edgeAdded', edge)
    })

    socket.on('edgeRemoved', (edgeId) => {
      const roomId = collaboratorIdToCollaborator[socket.id]?.roomId
      if (!roomId) return
      removeEdge(roomId, edgeId)
      socket.broadcast.to(roomId).emit('edgeRemoved', edgeId)
    })

    socket.on('toServerCollaboratorMoved', ({ x, y }) => {
      const roomId = collaboratorIdToCollaborator[socket.id]?.roomId
      if (!roomId) return
      socket.broadcast.to(roomId).emit('toClientCollaboratorMoved', { id: socket.id, x, y })
    })

    socket.on('disconnect', () => {
      const collaborator = collaboratorIdToCollaborator[socket.id]
      if (!collaborator) return
      socket.broadcast.to(collaborator.roomId).emit('collaboratorLeft', socket.id)

      delete collaboratorIdToCollaborator[socket.id]
    })

    socket.on('error', (error) => {
      console.error(error)
    })
  })

  return io
}
