import type { Ref } from "vue";
import type { UserEditableGraphOptions } from "./useUserEditableGraph";
import { usePersistentGraph } from "./usePersistentGraph";
import { io } from "socket.io-client";

const getSocketURL = () => {
  const isLocalhost = window.location.hostname === 'localhost'
  return isLocalhost ? 'http://localhost:3000' : '/'
}

export const useCollaborativeGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<UserEditableGraphOptions> = {}
) => {
  const graph = usePersistentGraph(canvas, options)
  const socket = io(getSocketURL())

  socket.on('connect', () => {
    console.log('socket connected')
  })

  socket.on('connect_error', (error) => {
    console.log('socket connection error', error)
  })

  graph.subscribe('onNodeAdded', (node) => {
    socket.emit('nodeAdded', node)
  })

  socket.on('nodeAdded', (node) => {
    console.log('received node from socket', node)
  })

  graph.subscribe('onNodeRemoved', (node) => {
    socket.emit('nodeRemoved', node)
  })

  socket.on('nodeRemoved', (node) => {
    console.log('received node removed from socket', node)
  })

  graph.subscribe('onEdgeAdded', (node) => {
    socket.emit('edgeAdded', node)
  })

  socket.on('edgeAdded', (node) => {
    console.log('received edge from socket', node)
  })

  graph.subscribe('onEdgeRemoved', (node) => {
    socket.emit('edgeRemoved', node)
  })

  socket.on('edgeRemoved', (node) => {
    console.log('received edge removed from socket', node)
  })

  return graph
}