/**
 * contains type defs and option defaults for base graph apis
 * such as addNode, removeNode, etc.
 */

export type FocusOption = {
  /**
   * whether to focus the newly added item via useFocusGraph
   * @default true
   */
  focus: boolean
}

/**
 * for constructing node/edge api options - used by base graph
 */
export type BroadcastOption = {
  /**
   * whether to broadcast the newly added node to
   * connected collaborators via useCollaborativeGraph (socket.io)
   * @default true
   */
  broadcast: boolean
}

export type AddNodeOptions = FocusOption & BroadcastOption

export const ADD_NODE_OPTIONS_DEFAULTS: AddNodeOptions = {
  focus: true,
  broadcast: true,
}

export type RemoveNodeOptions = BroadcastOption

export const REMOVE_NODE_OPTIONS_DEFAULTS: RemoveNodeOptions = {
  broadcast: true,
}