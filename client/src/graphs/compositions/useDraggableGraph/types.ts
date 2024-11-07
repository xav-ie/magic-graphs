import type { GNode } from "@graph/types"

/**
 * information for the node being dragged
 */
export type ActiveDragNode = {
  node: GNode,
  startingCoordinates: { x: number, y: number }
}