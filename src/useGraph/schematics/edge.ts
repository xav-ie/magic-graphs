import type { GEdge, GNode } from '../types'
import type { Line, Arrow } from '@/shapes/types'
import { getValue, getFromToNodes } from '../useGraphHelpers'
import type { GraphOptions } from '../useGraphBase'

export const getEdgeSchematic = (edge: GEdge, nodes: GNode[], options: GraphOptions) => {
  const { from, to } = getFromToNodes(edge, nodes)
  if (!from || !to) return

  const nodeSizeVal = getValue(options.nodeSize, to) + 10

  const angle = Math.atan2(to.y - from.y, to.x - from.x);

  const epiCenter = {
    x: to.x - nodeSizeVal * Math.cos(angle),
    y: to.y - nodeSizeVal * Math.sin(angle),
  }

  const edgeLine: Arrow = {
    start: { x: from.x, y: from.y },
    end: epiCenter,
    color: getValue(options.edgeColor, edge),
    width: getValue(options.edgeWidth, edge),
  }

  return edgeLine
}