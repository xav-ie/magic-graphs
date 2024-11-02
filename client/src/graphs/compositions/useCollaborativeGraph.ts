import type { Ref } from "vue";
import type { UserEditableGraphOptions } from "./useUserEditableGraph";
import { usePersistentGraph } from "./usePersistentGraph";
import { io, Socket } from "socket.io-client";
import type { GEdge, GNode } from "@graph/types";

const getSocketURL = () => {
  const isLocalhost = window.location.hostname === 'localhost'
  return isLocalhost ? 'http://localhost:3000' : '/'
}

interface GraphEvents {
  nodeAdded: (node: GNode) => void
  nodeRemoved: (nodeId: GNode['id']) => void
  edgeAdded: (edge: GEdge) => void
  edgeRemoved: (edgeId: GEdge['id']) => void
}

const STORE_ID_DURATION = 1000

export const useCollaborativeGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<UserEditableGraphOptions> = {}
) => {
  const graph = usePersistentGraph(canvas, options)
  const socket: Socket<GraphEvents, GraphEvents> = io(getSocketURL())

  const receivedIds = new Set<string>()

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
    if (receivedIds.has(node.id)) return
    receivedIds.add(node.id)
    setTimeout(() => receivedIds.delete(node.id), STORE_ID_DURATION)

    graph.addNode(node)
  })

  graph.subscribe('onNodeRemoved', (node) => {
    socket.emit('nodeRemoved', node)
  })

  socket.on('nodeRemoved', (node) => {
    if (receivedIds.has(node.id)) return
    receivedIds.add(node.id)
    setTimeout(() => receivedIds.delete(node.id), STORE_ID_DURATION)

    graph.removeNode(node)
  })

  graph.subscribe('onEdgeAdded', (node) => {
    socket.emit('edgeAdded', node)
  })

  socket.on('edgeAdded', (node) => {

  })

  graph.subscribe('onEdgeRemoved', (node) => {
    socket.emit('edgeRemoved', node)
  })

  socket.on('edgeRemoved', (node) => {
    console.log('received edge removed from socket', node)
  })

  return graph
}