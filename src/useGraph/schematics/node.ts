import type { GNode } from '../types'
import { getValue } from '../useGraphHelpers'
import type { Circle, Square } from '@/shapes/types'
import { type GraphOptions } from '../useGraphBase'

export type SupportedNodeShapes = 'circle' | 'square'

export const getNodeSchematic = (node: GNode, options: GraphOptions, focusedNodeId: GNode['id'] | undefined) => {
  const {
    nodeFocusColor,
    nodeColor,
    nodeBorderColor,
    nodeFocusBorderColor,
    nodeSize,
    nodeBorderWidth,
    nodeText,
    nodeTextSize,
    nodeTextColor,
    nodeShape,
  } = options

  const fillColor = node.id === focusedNodeId ? nodeFocusColor : nodeColor
  const borderColor = node.id === focusedNodeId ? nodeFocusBorderColor : nodeBorderColor

  const circleSchematic: Circle = {
    at: {
      x: node.x,
      y: node.y
    },
    radius: getValue(nodeSize, node),
    color: getValue(fillColor, node),
    stroke: {
      color: getValue(borderColor, node),
      width: getValue(nodeBorderWidth, node),
    },
    text: {
      content: getValue(nodeText, node),
      fontSize: getValue(nodeTextSize, node),
      fontWeight: 'bold',
      color: getValue(nodeTextColor, node),
    }
  }

  const squareSchematic: Square = {
    at: {
      x: node.x - getValue(nodeSize, node),
      y: node.y - getValue(nodeSize, node)
    },
    width: getValue(nodeSize, node) * 2,
    height: getValue(nodeSize, node) * 2,
    color: getValue(fillColor, node),
    stroke: {
      color: getValue(borderColor, node),
      width: getValue(nodeBorderWidth, node),
    },
    text: {
      content: getValue(nodeText, node),
      fontSize: getValue(nodeTextSize, node),
      fontWeight: 'bold',
      color: getValue(nodeTextColor, node),
    }
  }

  return getValue(nodeShape, node) === 'circle' ? circleSchematic : squareSchematic
}