import { Server } from 'socket.io'
import type { Collaborator, GraphEvents } from './graphTypes'
import { createServer } from 'http'
import { trackGraphState } from './trackGraphState'

export const sockets = (httpServer: ReturnType<typeof createServer>) => {
  const io = new Server<GraphEvents, GraphEvents, {}, {}>(httpServer, {
    cors: {
      origin: '*',
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

    socket.on('leaveRoom', (confirmationCallback) => {
      socket.leave(tracker.getRoomId())
      socket.broadcast.to(tracker.getRoomId()).emit('collaboratorLeft', socket.id)

      delete collaboratorIdToCollaborator[socket.id]
      confirmationCallback()
    })

    socket.on('nodeAdded', (node) => {
      tracker.addNode(node)
      socket.broadcast.to(tracker.getRoomId()).emit('nodeAdded', node)
    })

    socket.on('nodeRemoved', (nodeId) => {
      tracker.removeNode(nodeId)
      socket.broadcast.to(tracker.getRoomId()).emit('nodeRemoved', nodeId)
    })

    socket.on('nodeMoved', (node) => {
      tracker.updateNode(node.id, node)
      socket.broadcast.to(tracker.getRoomId()).emit('nodeMoved', node)
    })

    socket.on('edgeAdded', (edge) => {
      tracker.addEdge(edge)
      socket.broadcast.to(tracker.getRoomId()).emit('edgeAdded', edge)
    })

    socket.on('edgeRemoved', (edgeId) => {
      tracker.removeEdge(edgeId)
      socket.broadcast.to(tracker.getRoomId()).emit('edgeRemoved', edgeId)
    })

    socket.on('edgeWeightEdited', (edgeId, newWeight) => {
      tracker.updateEdge(edgeId, { weight: newWeight })
      socket.broadcast.to(tracker.getRoomId()).emit('edgeWeightEdited', edgeId, newWeight)
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
