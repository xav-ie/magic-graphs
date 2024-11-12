import type { GEdge, GNode } from "@graph/types";

/**
 * affected items that are nodes
 */
export type GNodeRecord = {
  graphType: 'node',
  data: GNode
}

/**
 * affected items that are edges
 */
export type GEdgeRecord = {
  graphType: 'edge',
  data: GEdge
}

/**
 * a record of an event stored in the history stack of a graph.
 * provides for undo/redo functionality
 */
export type HistoryRecord = {
  /**
   * the action that was taken in order to create this record.
   */
  action: 'add' | 'remove',
  /**
   * the items that were affected by the action.
   */
  affectedItems: (GNodeRecord | GEdgeRecord)[];
}