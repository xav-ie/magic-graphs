import type { GEdge, GNode, SchemaItem } from '../types'
import type { Arrow, UTurnArrow, Line } from '@/shapes/types'
import { getValue, getFromToNodes } from '../useGraphHelpers'
import type { BaseGraphTheme } from '../themes'
import { getLargestAngularSpace } from '@/shapes/helpers'

export const getEdgeSchematic = (
  edge: GEdge,
  nodes: GNode[],
  edges: GEdge[],
  graphTheme: BaseGraphTheme,
  focusedId: GEdge['id'] | undefined
): Omit<SchemaItem, 'priority'> | undefined => {
  const { from, to } = getFromToNodes(edge, nodes)

  const isBidirectional = edges.some(e => e.from === to.label && e.to === from.label)
  const isSelfDirecting = to === from

  const spacingFromNode = 3

  const nodeSizeVal = getValue(graphTheme.nodeSize, to) + spacingFromNode

  const angle = Math.atan2(to.y - from.y, to.x - from.x);

  const epiCenter = {
    x: to.x - nodeSizeVal * Math.cos(angle),
    y: to.y - nodeSizeVal * Math.sin(angle),
  }

  const start = { x: from.x, y: from.y }
  const end = epiCenter

  const edgeWidthVal = getValue(graphTheme.edgeWidth, edge)

  const bidirectionalEdgeSpacing = edgeWidthVal * 1.2

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

  const focusColorVal = getValue(graphTheme.edgeFocusColor, edge)
  const colorVal = getValue(graphTheme.edgeColor, edge)
  const isFocused = focusedId === edge.id
  const color = isFocused ? focusColorVal : colorVal

  const upDistance = edgeWidthVal * 8
  const downDistance = upDistance * 0.35

  const selfDirectedEdgeLine = {
    schema: {
      spacing: edgeWidthVal * 1.2,
      center: { x: from.x, y: from.y },
      upDistance,
      downDistance,
      angle: largestAngularSpace,
      lineWidth: edgeWidthVal,
      color,
    },
    schemaType: 'uturn',
    id: edge.id,
    graphType: 'edge',
  } as const;

  const edgeTextColor = isFocused ? graphTheme.edgeFocusTextColor : graphTheme.edgeTextColor
  const edgeTextColorVal = getValue(edgeTextColor, edge)

  const textArea = {
    color: graphTheme.graphBgColor,
    editable: true,
    text: {
      content: edge.weight.toString(),
      color: edgeTextColorVal,
      fontSize: getValue(graphTheme.edgeTextSize, edge),
      fontWeight: getValue(graphTheme.edgeTextFontWeight, edge),
    }
  }

  if (edge.type === 'undirected') {
    // find the edge that is in the opposite direction
    const oppositeEdge = edges.find(e => e.from === edge.to && e.to === edge.from)
    if (!oppositeEdge) return
    if (edge.id > oppositeEdge.id) return
    return {
      schema: {
        start: { x: from.x, y: from.y },
        end: { x: to.x, y: to.y },
        color,
        width: edgeWidthVal,
        textArea,
      },
      schemaType: 'line',
      id: edge.id,
      graphType: 'edge',
    }
  }

  const edgeLine = {
    schema: {
      start,
      end,
      color,
      width: getValue(graphTheme.edgeWidth, edge),
      // TODO - must take into account of actual node size.
      // TODO - 32 is approx default node size but wont work if node size is different
      textOffsetFromCenter: 32,
      textArea,
    },
    schemaType: 'arrow',
    id: edge.id,
    graphType: 'edge',
  } as const

  return isSelfDirecting ? selfDirectedEdgeLine : edgeLine
}