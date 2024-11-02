import type { GEdge, SchemaItem } from '@graph/types'
import { getConnectedNodes } from '@graph/helpers'
import { getLargestAngularSpace } from '@shape/helpers'
import type { BaseGraph } from '@graph/compositions/useBaseGraph'
import {
  line,
  arrow,
  uturn
} from '@shapes'
import colors, { darkenHex } from '@utils/colors'

export const getEdgeSchematic = (
  edge: GEdge,
  graph: Pick<BaseGraph, 'edges' | 'getNode' | 'getTheme' | 'settings'>,
): Omit<SchemaItem, 'priority'> | undefined => {

  const { from, to } = getConnectedNodes(edge, graph)

  const isThereAnEdgeGoingTheOtherWay = graph.edges.value.some(e => e.from === to.id && e.to === from.id)
  const isSelfDirecting = to === from

  const spacingAwayFromNode = 3

  const fromNodeSize = graph.getTheme('nodeSize', from) + spacingAwayFromNode
  const toNodeSize = graph.getTheme('nodeSize', to) + spacingAwayFromNode

  const fromNodeBorderWidth = graph.getTheme('nodeBorderWidth', from)
  const toNodeBorderWidth = graph.getTheme('nodeBorderWidth', to)

  const angle = Math.atan2(to.y - from.y, to.x - from.x);

  const epiCenter = {
    x: to.x - toNodeSize * Math.cos(angle),
    y: to.y - toNodeSize * Math.sin(angle),
  }

  const start = { x: from.x, y: from.y }
  const end = epiCenter

  const edgeWidth = graph.getTheme('edgeWidth', edge)

  const bidirectionalEdgeSpacing = edgeWidth * 1.2

  if (isThereAnEdgeGoingTheOtherWay) {
    start.x += Math.cos(angle + Math.PI / 2) * bidirectionalEdgeSpacing
    start.y += Math.sin(angle + Math.PI / 2) * bidirectionalEdgeSpacing

    end.x += Math.cos(angle + Math.PI / 2) * bidirectionalEdgeSpacing
    end.y += Math.sin(angle + Math.PI / 2) * bidirectionalEdgeSpacing
  }

  const largestAngularSpace = getLargestAngularSpace(
    start,
    // filter to remove self-referencing edge
    // map to convert to { x, y } format
    // filter to remove duplicates. (yonava: check if this is necessary, im not sure)
    graph.edges.value
      .filter((e) => (e.from === from.id || e.to === to.id) && e.from !== e.to)
      .map((e) => {
        const { from: fromNode, to: toNode } = getConnectedNodes(e, graph)
        return from.id === fromNode.id ? { x: toNode.x, y: toNode.y } : { x: fromNode.x, y: fromNode.y }
      })
      .filter((point, index, self) =>
        index === self.findIndex(
          (p) => p.x === point.x && p.y === point.y
        )
      )
  )

  const color = graph.getTheme('edgeColor', edge)
  const edgeTextColor = graph.getTheme('edgeTextColor', edge)

  const graphBgColor = graph.getTheme('graphBgColor')

  const edgeTextSize = graph.getTheme('edgeTextSize', edge)
  const edgeTextFontWeight = graph.getTheme('edgeTextFontWeight', edge)

  const textAreaOnEdge = {
    color: graphBgColor,
    activeColor: darkenHex(graphBgColor, 25),
    text: {
      content: edge.weight.toString(),
      color: edgeTextColor,
      fontSize: edgeTextSize,
      fontWeight: edgeTextFontWeight,
    }
  }

  const { displayEdgeLabels } = graph.settings.value
  const textArea = displayEdgeLabels ? textAreaOnEdge : undefined

  const upDistance = edgeWidth * 8
  const downDistance = upDistance * 0.5

  if (isSelfDirecting) {
    const shape = uturn({
      spacing: edgeWidth * 1.2,
      center: { x: from.x, y: from.y },
      upDistance,
      downDistance,
      angle: largestAngularSpace,
      lineWidth: edgeWidth,
      color,
      textArea,
    })

    return {
      shape,
      id: edge.id,
      graphType: 'edge',
    }
  }

  const sumOfToAndFromNodeSize = fromNodeSize + fromNodeBorderWidth / 2 + toNodeSize + toNodeBorderWidth / 2
  const distanceSquaredBetweenNodes = (from.x - to.x) ** 2 + (from.y - to.y) ** 2
  const areNodesTouching = (sumOfToAndFromNodeSize ** 2) > distanceSquaredBetweenNodes

  if (areNodesTouching) return

  if (edge.type === 'undirected') {
    const shape = line({
      start: { x: from.x, y: from.y },
      end: { x: to.x, y: to.y },
      width: edgeWidth,
      color,
      textArea,
    })

    return {
      shape,
      id: edge.id,
      graphType: 'edge',
    }
  }

  const shape = arrow({
    start,
    end,
    width: edgeWidth,
    // TODO - must take into account of actual node size.
    // TODO - 32 is approx default node size but wont work if node size is different
    textOffsetFromCenter: 32,
    color,
    textArea,
  })

  return {
    shape,
    id: edge.id,
    graphType: 'edge',
  }
}