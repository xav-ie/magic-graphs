import type { Ref } from "vue"
import type { Graph } from "@graph/types"
import type { CollaboratorMap, GraphSocketEvents, CollabSocketEvents } from "./types"
import type { Socket } from "socket.io-client"

type SocketEventOptions = {
  graph: Graph,
  collaborators: Ref<CollaboratorMap>
}

const collabEvents = ({ collaborators }: SocketEventOptions): CollabSocketEvents => ({
  'collaboratorJoined': (collaborator) => {
    collaborators.value[collaborator.id] = collaborator
  },
  'collaboratorLeft': (collaboratorId) => {
    delete collaborators.value[collaboratorId]
  },
  'collaboratorMoved': ({ x, y, id }) => {
    const movedCollaborator = collaborators.value[id]
    if (!movedCollaborator) throw new Error('moving collaborator not found')
    movedCollaborator.mousePosition = { x, y }
  }
})

const graphEvents = ({ graph }: SocketEventOptions): GraphSocketEvents => ({
  'nodeAdded': (node) => {
    graph.addNode(node, { broadcast: false, focus: false, history: false })
  },
  'nodeRemoved': (nodeId) => {
    graph.removeNode(nodeId, { broadcast: false, history: false })
  },
  'nodeMoved': (node) => {
    graph.moveNode(node.id, node, { broadcast: false })
  },
  'edgeAdded': (edge) => {
    graph.addEdge(edge, { broadcast: false, focus: false, history: false })
  },
  'edgeRemoved': (edgeId) => {
    graph.removeEdge(edgeId, { broadcast: false, history: false })
  },
  'edgeLabelEdited': (edgeId, newLabel) => {
    const edge = graph.getEdge(edgeId)
    if (!edge) throw new Error('edge not found')
    edge.label = newLabel
  },
})

const events = (options: SocketEventOptions) => ({
  ...graphEvents(options),
  ...collabEvents(options)
})

const listen = (socket: Socket, options: SocketEventOptions) => {
  const eventHandlers = events(options)
  for (const [event, handler] of Object.entries(eventHandlers)) {
    socket.on(event, handler)
  }
}