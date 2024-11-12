import type { GEdge, GNode } from "@graph/types";

/**
 * affected items that are nodes
 */
export type GNodeRecord = {
  graphType: 'node',
  data: GNode
}

export type GNodeMoveRecord = {
  graphType: 'node',
  id: string,
  x: number,
  y: number
}

/**
 * affected items that are edges
 */
export type GEdgeRecord = {
  graphType: 'edge',
  data: GEdge
}

/**
 * a record indicating an item in the graph was added or removed
 */
export type AddRemoveRecord = {
  /**
   * the action that was taken in order to create this record.
   */
  action: 'add' | 'remove',
  /**
   * the items that were affected by the action.
   */
  affectedItems: (GNodeRecord | GEdgeRecord)[];
}

/**
 * a record indicating an item in the graph was moved
 */
export type MoveRecord = {
  /**
   * the action that was taken in order to create this record.
   */
  action: 'move',
  /**
   * the items that were affected by the action.
   */
  affectedItems: GNodeMoveRecord[];
}

/**
 * a record of an event stored in the history stack of a graph.
 * provides for undo/redo functionality
 */
export type HistoryRecord = AddRemoveRecord | MoveRecord;