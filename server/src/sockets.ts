import { Server } from 'socket.io'
import type { Collaborator, GraphEvents } from './graphTypes'
import { createServer } from 'http'

export const sockets = (httpServer: ReturnType<typeof createServer>) => {
  const io = new Server<GraphEvents, GraphEvents, {}, {}>(httpServer, {
    cors: {
      origin: '*',
    },
  })

  const collaboratorIdToCollaborator: Record<string, Collaborator & { roomId: string }> = {}

  io.on('connection', (socket) => {
    socket.on('joinRoom', (joinRoomDetails, mapCallback) => {
      socket.join(joinRoomDetails.roomId)
      socket.broadcast.to(joinRoomDetails.roomId).emit('collaboratorJoined', joinRoomDetails)
      mapCallback(collaboratorIdToCollaborator)
      collaboratorIdToCollaborator[socket.id] = joinRoomDetails
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
      socket.broadcast.to(roomId).emit('nodeAdded', node)
    })

    socket.on('nodeRemoved', (node) => {
      const roomId = collaboratorIdToCollaborator[socket.id]?.roomId
      if (!roomId) return
      socket.broadcast.to(roomId).emit('nodeRemoved', node)
    })

    socket.on('nodeMoved', (node) => {
      const roomId = collaboratorIdToCollaborator[socket.id]?.roomId
      if (!roomId) return
      socket.broadcast.to(roomId).emit('nodeMoved', node)
    })

    socket.on('edgeAdded', (edge) => {
      const roomId = collaboratorIdToCollaborator[socket.id]?.roomId
      if (!roomId) return
      socket.broadcast.to(roomId).emit('edgeAdded', edge)
    })

    socket.on('edgeRemoved', (edge) => {
      const roomId = collaboratorIdToCollaborator[socket.id]?.roomId
      if (!roomId) return
      socket.broadcast.to(roomId).emit('edgeRemoved', edge)
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
