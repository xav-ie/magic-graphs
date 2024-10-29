import type {
  CircleSchemaItem,
  GNode,
  SquareSchemaItem
} from '@graph/types'
import type { ThemeGetter } from '@graph/helpers'
import type { Circle, Square } from '@shape/types'

export type SupportedNodeShapes = 'circle' | 'square'

type NodeSchemas = SquareSchemaItem | CircleSchemaItem
type NodeSchematic = Omit<NodeSchemas, 'priority'> | undefined

export const getNodeSchematic = (
  node: GNode,
  getTheme: ThemeGetter,
): NodeSchematic => {

  const color = getTheme('nodeColor', node)
  const borderColor = getTheme('nodeBorderColor', node)
  const size = getTheme('nodeSize', node)
  const borderWidth = getTheme('nodeBorderWidth', node)
  const text = getTheme('nodeText', node)
  const textSize = getTheme('nodeTextSize', node)
  const textColor = getTheme('nodeTextColor', node)
  const shape = getTheme('nodeShape', node)

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