import type { GEdge, GNode } from '../types'
import type { Arrow, UTurnArrow } from '@/shapes/types'
import { getValue, getFromToNodes } from '../useGraphHelpers'
import type { BaseGraphTheme } from '../themes'
import { getLargestAngularSpace } from '@/shapes/helpers'

export const getEdgeSchematic = (
  edge: GEdge,
  nodes: GNode[],
  edges: GEdge[],
  options: BaseGraphTheme,
  focusedId: GEdge['id'] | undefined
) => {
  const { from, to } = getFromToNodes(edge, nodes)

  const isBidirectional = edges.some(e => e.from === to.label && e.to === from.label)
  const isSelfDirecting = to === from

  const spacingFromNode = 3

  const nodeSizeVal = getValue(options.nodeSize, to) + spacingFromNode

  const angle = Math.atan2(to.y - from.y, to.x - from.x);

  const epiCenter = {
    x: to.x - nodeSizeVal * Math.cos(angle),
    y: to.y - nodeSizeVal * Math.sin(angle),
  }

  const start = { x: from.x, y: from.y }
  const end = epiCenter

  const bidirectionalEdgeSpacing = 12

  if (isBidirectional) {
    start.x += Math.cos(angle + Math.PI / 2) * bidirectionalEdgeSpacing
    start.y += Math.sin(angle + Math.PI / 2) * bidirectionalEdgeSpacing

    end.x += Math.cos(angle + Math.PI / 2) * bidirectionalEdgeSpacing
    end.y += Math.sin(angle + Math.PI / 2) * bidirectionalEdgeSpacing
  }

  const largestAngularSpace = getLargestAngularSpace(start, edges
    // remove self-referencing edge
    .filter((e) => (e.from === from.label || e.to === to.label) && e.from !== e.to)
    // convert to { x, y } format
    .map((e) => {
      const { from: fromNode, to: toNode } = getFromToNodes(e, nodes)
      return from.id === fromNode.id ? { x: toNode.x, y: toNode.y } : { x: fromNode.x, y: fromNode.y }
    })
    // remove duplicates (such as bi-directional edges)
    .filter((point, index, self) =>
        index === self.findIndex(
          (p) => p.x === point.x && p.y === point.y
        )
    )
  )

  const focusColorVal = getValue(options.edgeFocusColor, edge)
  const colorVal = getValue(options.edgeColor, edge)
  const isFocused = focusedId === edge.id
  const color = isFocused ? focusColorVal : colorVal

  const selfDirectedEdgeLine: UTurnArrow = {
    spacing: 14,
    center: { x: from.x, y: from.y },
    upDistance: 80,
    downDistance: 25,
    angle: largestAngularSpace,
    lineWidth: getValue(options.edgeWidth, edge),
    color,
  };

  const edgeTextColor = isFocused ? options.edgeFocusTextColor : options.edgeTextColor
  const edgeTextColorVal = getValue(edgeTextColor, edge)

  const edgeLine: Arrow = {
    start,
    end,
    color,
    width: getValue(options.edgeWidth, edge),
    // TODO - must take into account of actual node size.
    // TODO - 35 is the default node size but wont work if node size is different
    textOffsetFromCenter: 35,
    textArea: {
      color: options.graphBgColor,
      editable: true,
      text: {
        content: edge.weight.toString(),
        color: edgeTextColorVal,
        fontSize: getValue(options.edgeTextSize, edge),
        fontWeight: getValue(options.edgeTextFontWeight, edge),
      }
    }
  }

  return isSelfDirecting ? selfDirectedEdgeLine : edgeLine
}