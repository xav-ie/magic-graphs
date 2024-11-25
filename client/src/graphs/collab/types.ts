import type { GEdge, GNode } from "@graph/types"
import colors from "@colors"
import type { ProductInfo } from "src/types"

/**
 * data for a collaborator that is not connected to a single
 * instance of collaboration or socket
 */
export type CollaboratorProfile = {
  /**
   * the display name of the collaborator
   */
  name: string
  /**
   * the display color of the collaborator
   */
  color: string
}

/**
 * a person connected to a room
 */
export type Collaborator = {
  /**
   * unique id for the collaborator, tied to their socket id
   */
  id: string
  /**
   * the current mouse coordinates of the collaborator on the canvas
   */
  mousePosition: { x: number, y: number }
  /**
   * the id of the product that the collaborator is currently active on
   */
  productId: ProductInfo['productId']
} & CollaboratorProfile

export type CollaboratorMove = {
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

export type GraphSocketEvents = {
  nodeAdded: (node: GNode) => void
  nodeRemoved: (nodeId: GNode['id']) => void
  nodeMoved: (node: GNode) => void

  edgeAdded: (edge: GEdge) => void
  edgeRemoved: (edgeId: GEdge['id']) => void
  edgeLabelEdited: (edgeId: GEdge['id'], label: string) => void
}

export type CollabSocketEvents = {
  collaboratorJoined: (collaborator: Collaborator) => void
  collaboratorLeft: (collaboratorId: Collaborator['id']) => void
  collaboratorMoved: (collaboratorMove: CollaboratorMove) => void
}

export type ConnectionSocketEvents = {
  joinRoom: (
    joinOptions: {
      roomId: string,
      me: Collaborator,
      graphState: GraphState
    },
    mapCallback: (collabMap: CollaboratorMap, graphState: GraphState) => void
  ) => void

  leaveRoom: (confirmationCallback: () => void) => void
}

/**
 * client-server + server-client events send via socket.io
 */
export type SocketEvents = GraphSocketEvents & CollabSocketEvents & ConnectionSocketEvents

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