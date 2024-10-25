import type { CircleSchemaItem, GNode, SquareSchemaItem } from '../types'
import type { ThemeGetter } from '../helpers'
import type { Circle, Square } from '@/shapes/types'

export type SupportedNodeShapes = 'circle' | 'square'

type NodeSchemas = SquareSchemaItem | CircleSchemaItem
type NodeSchematic = Omit<NodeSchemas, 'priority'> | undefined

export const getNodeSchematic = (
  node: GNode,
  getTheme: ThemeGetter,
  focusedNodeId: GNode['id'] | undefined
): NodeSchematic => {

  const defaultColor = getTheme('nodeColor', node)
  const focusColor = getTheme('nodeFocusColor', node)
  const defaultBorderColor = getTheme('nodeBorderColor', node)
  const focusBorderColor = getTheme('nodeFocusBorderColor', node)
  const size = getTheme('nodeSize', node)
  const borderWidth = getTheme('nodeBorderWidth', node)
  const text = getTheme('nodeText', node)
  const textSize = getTheme('nodeTextSize', node)
  const defaultTextColor = getTheme('nodeTextColor', node)
  const focusTextColor = getTheme('nodeFocusTextColor', node)
  const shape = getTheme('nodeShape', node)

  const color = node.id === focusedNodeId ? focusColor : defaultColor
  const borderColor = node.id === focusedNodeId ? focusBorderColor : defaultBorderColor
  const textColor = node.id === focusedNodeId ? focusTextColor : defaultTextColor

  const circleSchematic: Circle = {
    at: {
      x: node.x,
      y: node.y
    },
    radius: size,
    color: color,
    stroke: {
      color: borderColor,
      width: borderWidth,
    },
    text: {
      content: text,
      fontSize: textSize,
      fontWeight: 'bold',
      color: textColor,
    }
  }

  const squareSchematic: Square = {
    at: {
      x: node.x - size,
      y: node.y - size
    },
    width: size * 2,
    height: size * 2,
    color: color,
    stroke: {
      color: borderColor,
      width: borderWidth,
    },
    text: {
      content: text,
      fontSize: textSize,
      fontWeight: 'bold',
      color: textColor,
    }
  }

  return {
    schema: shape === 'circle' ? circleSchematic : squareSchematic,
    schemaType: shape,
    id: node.id,
    graphType: 'node',
  }
}