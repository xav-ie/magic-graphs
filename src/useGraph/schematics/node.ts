import type { CircleSchemaItem, GNode, SquareSchemaItem } from '../types'
import { getValue } from '../helpers'
import type { Circle, Square } from '@/shapes/types'
import type { BaseGraphTheme } from '../themes'

export type SupportedNodeShapes = 'circle' | 'square'

type NodeSchemas = SquareSchemaItem | CircleSchemaItem
type NodeSchematic = Omit<NodeSchemas, 'priority'> | undefined

export const getNodeSchematic = (
  node: GNode,
  graphTheme: BaseGraphTheme,
  focusedNodeId: GNode['id'] | undefined
): NodeSchematic => {
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
    nodeFocusTextColor,
    nodeShape,
  } = graphTheme

  const fillColor = node.id === focusedNodeId ? nodeFocusColor : nodeColor
  const borderColor = node.id === focusedNodeId ? nodeFocusBorderColor : nodeBorderColor
  const textColor = node.id === focusedNodeId ? nodeFocusTextColor : nodeTextColor

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
      color: getValue(textColor, node),
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
      color: getValue(textColor, node),
    }
  }

  const nodeShapeVal = getValue(nodeShape, node)

  return {
    schema: nodeShapeVal === 'circle' ? circleSchematic : squareSchematic,
    schemaType: nodeShapeVal,
    id: node.id,
    graphType: 'node',
  }
}