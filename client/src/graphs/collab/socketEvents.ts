import type { Ref } from "vue"
import type { GEdge, GNode, Graph } from "@graph/types"
import type { Collaborator, CollaboratorMap, ToClientCollaboratorMove } from "./types"

type SocketEventOptions = {
  graph: Graph,
  collaborators: Ref<CollaboratorMap>
}

const collabEvents = ({ collaborators }: SocketEventOptions) => ({
  'collaboratorJoined': (collaborator: Collaborator) => {
    collaborators.value[collaborator.id] = collaborator
  },
  'collaboratorLeft': (collaboratorId: Collaborator['id']) => {
    delete collaborators.value[collaboratorId]
  },
  'toServerCollaboratorMoved': (collaboratorMove: ToClientCollaboratorMove) => {
    collaborators.value[collaboratorMove.id].mousePosition = { x: collaboratorMove.x, y: collaboratorMove.y }
  }
})

const graphEvents = ({ graph }: SocketEventOptions) => ({
  'nodeAdded': (node: GNode) => {
    graph.addNode(node, { broadcast: false, focus: false, history: false })
  },
  'nodeRemoved': (nodeId: GNode['id']) => {
    graph.removeNode(nodeId, { broadcast: false, history: false })
  },
  'nodeMoved': (node: GNode) => {
    graph.moveNode(node.id, node, { broadcast: false })
  },
  'edgeAdded': (edge: GEdge) => {
    graph.addEdge(edge, { broadcast: false, focus: false, history: false })
  },
  'edgeRemoved': (edgeId: GEdge['id']) => {
    graph.removeEdge(edgeId, { broadcast: false, history: false })
  },
  'edgeLabelEdited': (edgeId: GEdge['id'], newLabel: string) => {
    const edge = graph.getEdge(edgeId)
    if (!edge) throw new Error('edge not found')
    edge.label = newLabel
  },
})

const events = (options: SocketEventOptions) => ({
  ...graphEvents(options),
  ...collabEvents(options)
})