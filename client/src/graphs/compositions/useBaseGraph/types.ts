/**
 * contains type defs and option defaults for base graph apis
 * such as addNode, removeNode, etc.
 */

export type FocusOption = {
  /**
   * whether to focus the newly added item
   * @default true
   */
  focus: boolean
}

/**
 * for constructing node/edge api options - used by base graph
 */
export type BroadcastOption = {
  /**
   * whether to broadcast the newly added item to
   * connected collaborators
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

export type AddEdgeOptions = FocusOption & BroadcastOption

export const ADD_EDGE_OPTIONS_DEFAULTS: AddEdgeOptions = {
  broadcast: true,
  focus: false,
}

export const ADD_EDGE_DEFAULTS = {
  type: 'directed',
  weight: 1,
  label: '',
} as const

export type RemoveEdgeOptions = BroadcastOption

export const REMOVE_EDGE_OPTIONS_DEFAULTS: RemoveEdgeOptions = {
  broadcast: true,
}

export type MoveNodeOptions = BroadcastOption

export const MOVE_NODE_OPTIONS_DEFAULTS: MoveNodeOptions = {
  broadcast: true,
}