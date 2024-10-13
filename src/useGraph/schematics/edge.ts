import type { GEdge, GNode } from '../types'
import type { Line, Arrow } from '@/shapes/types'
import { getValue, getFromToNodes } from '../useGraphHelpers'
import type { GraphOptions } from '../useGraphBase'

export const getEdgeSchematic = (edge: GEdge, nodes: GNode[], edges: GEdge[], options: GraphOptions) => {
  const { from, to } = getFromToNodes(edge, nodes)
  if (!from || !to) return

  const isBidirectional = edges.some(e => e.from === to.label && e.to === from.label)

  const nodeSizeVal = getValue(options.nodeSize, to) + 10

  const angle = Math.atan2(to.y - from.y, to.x - from.x);

  const epiCenter = {
    x: to.x - nodeSizeVal * Math.cos(angle),
    y: to.y - nodeSizeVal * Math.sin(angle),
  }

  const start = { x: from.x, y: from.y }
  const end = epiCenter

  const lineSpacing = 12

  if (isBidirectional) {
    start.x += Math.cos(angle + Math.PI / 2) * lineSpacing
    start.y += Math.sin(angle + Math.PI / 2) * lineSpacing

    end.x += Math.cos(angle + Math.PI / 2) * lineSpacing
    end.y += Math.sin(angle + Math.PI / 2) * lineSpacing
  }

  const edgeLine: Arrow = {
    start,
    end,
    color: getValue(options.edgeColor, edge),
    width: getValue(options.edgeWidth, edge),
  }

  return edgeLine
}