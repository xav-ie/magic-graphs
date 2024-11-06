import type { ThemeGetter } from '@graph/themes/getThemeResolver'
import type { GNode, SchemaItem } from '@graph/types'
import { circle, square } from '@shapes'
import colors from '@colors'

export type SupportedNodeShapes = 'circle' | 'square'

export const getNodeSchematic = (
  node: GNode,
  getTheme: ThemeGetter,
): Omit<SchemaItem, 'priority'> | undefined => {

  const color = getTheme('nodeColor', node)
  const borderColor = getTheme('nodeBorderColor', node)
  const size = getTheme('nodeSize', node)
  const borderWidth = getTheme('nodeBorderWidth', node)
  const text = getTheme('nodeText', node)
  const textSize = getTheme('nodeTextSize', node)
  const textColor = getTheme('nodeTextColor', node)
  const shape = getTheme('nodeShape', node)

  const circleShape = circle({
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
    textArea: {
      text: {
        content: text,
        fontSize: textSize,
        fontWeight: 'bold',
        color: textColor,
      },
      color: colors.TRANSPARENT
    }
  })

  const squareShape = square({
    at: {
      x: node.x - size,
      y: node.y - size
    },
    size: size * 2,
    color: color,
    stroke: {
      color: borderColor,
      width: borderWidth,
    },
    textArea: {
      text: {
        content: text,
        fontSize: textSize,
        fontWeight: 'bold',
        color: textColor,
      },
      color: colors.TRANSPARENT
    }
  })

  return {
    shape: shape === 'circle' ? circleShape : squareShape,
    id: node.id,
    graphType: 'node',
  }
}