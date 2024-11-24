import type { Socket } from "socket.io-client";
import type { SocketEvents } from "./types";
import type { GraphEventMap } from "@graph/events";
import type { Graph } from "@graph/types";

export const graphEmitters = (
  socket: Socket<SocketEvents, SocketEvents>
): Partial<GraphEventMap> => ({
  onNodeAdded: (node, { broadcast }) => {
    if (!broadcast) return
    socket.emit('nodeAdded', node)
  },
  onBulkEdgeAdded: (edges, { broadcast }) => {
    if (!broadcast) return
    for (const edge of edges) {
      socket.emit('edgeAdded', edge)
    }
  },
  onNodeRemoved: (node, _, { broadcast }) => {
    if (!broadcast) return
    socket.emit('nodeRemoved', node.id)
  },
  onBulkNodeRemoved: (nodes, _, { broadcast }) => {
    if (!broadcast) return
    for (const node of nodes) {
      socket.emit('nodeRemoved', node.id)
    }
  },
  onNodeMoved: (node, { broadcast }) => {
    if (!broadcast) return
    socket.emit('nodeMoved', node)
  },
  onEdgeAdded: (edge, { broadcast }) => {
    if (!broadcast) return
    socket.emit('edgeAdded', edge)
  },
  onEdgeRemoved: (edge, { broadcast }) => {
    if (!broadcast) return
    socket.emit('edgeRemoved', edge.id)
  },
  onEdgeLabelChange: (edge) => {
    socket.emit('edgeLabelEdited', edge.id, edge.label)
  },
  onMouseMove: ({ coords }) => {
    if (!socket.id) throw new Error('socket id not found')
    socket.emit('collaboratorMoved', { ...coords, id: socket.id })
  },
})

type SocketEmitOptions = {
  graph: Graph
}

export const startEmitting = (
  socket: Socket<SocketEvents, SocketEvents>,
  { graph }: SocketEmitOptions
) => {
  const eventHandlers = graphEmitters(socket)
  for (const [event, handler] of Object.entries(eventHandlers)) {
    // @ts-ignore ts cant handle Object.entries return type
    graph.subscribe(event, handler)
  }
}

export const stopEmitting = (
  socket: Socket<SocketEvents, SocketEvents>,
  { graph }: SocketEmitOptions
) => {
  const eventHandlers = graphEmitters(socket)
  for (const [event, handler] of Object.entries(eventHandlers)) {
    // @ts-ignore ts cant handle Object.entries return type
    graph.unsubscribe(event, handler)
  }
}