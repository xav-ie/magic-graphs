import type { GEdge, GNode } from "@graph/types"
import colors from "@colors"

/**
 * a collaborators info
 */
export type Collaborator = {
  id: string
  name: string
  color: string
  mousePosition: { x: number, y: number }
}

/**
 * sends a collaborators mouse movement from the client to the server.
 * does not include the collaborators id, as the server knows this.
 */
export type ToServerCollaboratorMove = {
  x: number
  y: number
}

/**
 * sends a collaborators mouse movement from the server to the client.
 */
export type ToClientCollaboratorMove = {
  id: Collaborator['id']
  x: number
  y: number
}

/**
 * maps a collaborators id to their info
 */
export type CollaboratorMap = Record<Collaborator['id'], Collaborator>

/**
 * graph state for collaborative graph
 */
export type GraphState = {
  nodes: GNode[],
  edges: GEdge[]
}

/**
 * client-server + server-client events send via socket.io
 */
export interface GraphEvents {
  nodeAdded: (node: GNode) => void
  nodeRemoved: (nodeId: GNode['id']) => void
  nodeMoved: (node: GNode) => void

  edgeAdded: (edge: GEdge) => void
  edgeRemoved: (edgeId: GEdge['id']) => void
  edgeWeightEdited: (edgeId: GEdge['id'], weight: number) => void

  collaboratorJoined: (collaborator: Collaborator) => void
  collaboratorLeft: (collaboratorId: Collaborator['id']) => void

  toServerCollaboratorMoved: (collaboratorMove: ToServerCollaboratorMove) => void
  toClientCollaboratorMoved: (collaboratorMove: ToClientCollaboratorMove) => void

  joinRoom: (
    joinOptions: Collaborator & { roomId: string },
    joinWithGraphState: GraphState | null,
    mapCallback: (collabMap: CollaboratorMap, graphState: GraphState) => void
  ) => void

  leaveRoom: (confirmationCallback: () => void) => void
}

/**
 * list of colors that may be assigned to collaborators
 */
export const COLLAB_COLORS = [
  colors.AMBER_600,
  colors.BLUE_600,
  colors.CYAN_600,
  colors.GREEN_600,
  colors.INDIGO_600,
  colors.LIME_600,
  colors.ORANGE_600,
  colors.PINK_600,
  colors.PURPLE_600,
  colors.RED_600,
]

/**
 * list of default names for collaborators
 */
export const COLLAB_NAMES = [
  'Joud',
  'Zavier',
  'Thomas',
  'Jaime',
  'Dila',
  'Bella',
  'Julian',
  'Adriana',
  'Juliana',
  'Yona'
]