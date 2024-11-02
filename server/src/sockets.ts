import { Server } from 'socket.io'
import type { GraphEvents } from './graphTypes'
import { createServer } from 'http'
import { LOCALHOST_PORT } from './constants'

export const sockets = (httpServer: ReturnType<typeof createServer>) => {
  const io = new Server<GraphEvents, GraphEvents, {}, {}>(httpServer, {
    cors: {
      origin: '*',
    },
  })

  io.on('connection', (socket) => {
    socket.on('nodeAdded', (node) => {
      socket.broadcast.emit('nodeAdded', node)
    })

    socket.on('nodeRemoved', (node) => {
      socket.broadcast.emit('nodeRemoved', node)
    })

    socket.on('nodeMoved', (node) => {
      socket.broadcast.emit('nodeMoved', node)
    })

    socket.on('edgeAdded', (edge) => {
      socket.broadcast.emit('edgeAdded', edge)
    })

    socket.on('edgeRemoved', (edge) => {
      socket.broadcast.emit('edgeRemoved', edge)
    })

    socket.on('collaboratorJoined', (collaborator) => {
      socket.broadcast.emit('collaboratorJoined', collaborator)
    })

    socket.on('collaboratorMoved', (collaboratorMove) => {
      socket.broadcast.emit('collaboratorMoved', collaboratorMove)
    })

    socket.on('disconnect', () => {
      console.log('User disconnected')
    })

    socket.on('error', (error) => {
      console.error(error)
    })
  })

  return io
}

// io.listen(PORT)
// console.log(`Sockets listening on port ${PORT}`)
