/**
 * contains type defs and option defaults for base graph apis
 * such as addNode, removeNode, etc.
 */

export type FocusOption = {
  /**
   * whether to focus the newly added item
   */
  focus: boolean
}

export type HistoryOption = {
  /**
   * whether to record this action in the history stack
   */
  history: boolean
}

export type BroadcastOption = {
  /**
   * whether to broadcast the newly added item to
   * connected collaborators
   */
  broadcast: boolean
}

export type AddNodeOptions = FocusOption & BroadcastOption & HistoryOption

export const ADD_NODE_OPTIONS_DEFAULTS: AddNodeOptions = {
  broadcast: true,
  focus: true,
  history: true,
}

export type RemoveNodeOptions = BroadcastOption & HistoryOption

export const REMOVE_NODE_OPTIONS_DEFAULTS: RemoveNodeOptions = {
  broadcast: true,
  history: true,
}

export type AddEdgeOptions = FocusOption & BroadcastOption & HistoryOption

export const ADD_EDGE_OPTIONS_DEFAULTS: AddEdgeOptions = {
  broadcast: true,
  focus: false,
  history: true,
}

export type RemoveEdgeOptions = BroadcastOption & HistoryOption

export const REMOVE_EDGE_OPTIONS_DEFAULTS: RemoveEdgeOptions = {
  broadcast: true,
  history: true,
}

export type MoveNodeOptions = BroadcastOption

export const MOVE_NODE_OPTIONS_DEFAULTS: MoveNodeOptions = {
  broadcast: true,
}

/**
 * defaults for newly added edges
 */
export const ADD_EDGE_DEFAULTS = {
  type: 'directed',
  label: '',
} as const