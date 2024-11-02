import { Server } from 'socket.io'

type GNode = {}
type GEdge = {}

interface GraphEvents {
  nodeAdded: (node: GNode) => void
  nodeRemoved: (node: GNode) => void
  edgeAdded: (edge: GEdge) => void
  edgeRemoved: (edge: GEdge) => void
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

console.log('Sockets Live!')
