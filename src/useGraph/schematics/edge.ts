import type { GEdge, GNode } from '../types'
import type { Line } from '@/shapes/types'
import { getValue, getFromToNodes } from '../useGraphHelpers'
import type { GraphOptions } from '../useGraphBase'

export const getEdgeSchematic = (edge: GEdge, nodes: GNode[], options: GraphOptions) => {
  const { from, to } = getFromToNodes(edge, nodes)
  if (!from || !to) return

  const edgeLine: Line = {
    start: { x: from.x, y: from.y },
    end: { x: to.x, y: to.y },
    color: getValue(options.edgeColor, edge),
    width: getValue(options.edgeWidth, edge),
  }

  return edgeLine
}