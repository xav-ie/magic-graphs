import { Server } from 'socket.io'
import type { GEdge, GNode } from './graphTypes'

interface GraphEvents {
  nodeAdded: (node: GNode) => void
  nodeRemoved: (node: GNode['id']) => void
  edgeAdded: (edge: GEdge) => void
  edgeRemoved: (edge: GEdge['id']) => void
}

const io = new Server<GraphEvents, GraphEvents, {}, {}>({
  cors: {
    origin: '*',
  }
})

io.on('connection', (socket) => {
  socket.on('nodeAdded', (node) => {
    io.emit('nodeAdded', node)
  })

  socket.on('nodeRemoved', (node) => {
    io.emit('nodeRemoved', node)
  })

  socket.on('edgeAdded', (edge) => {
    io.emit('edgeAdded', edge)
  })

  socket.on('edgeRemoved', (edge) => {
    io.emit('edgeRemoved', edge)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })

  socket.on('error', (error) => {
    console.error(error)
  })
})

const PORT = 3000
io.listen(PORT)
console.log(`Sockets listening on port ${PORT}`)
