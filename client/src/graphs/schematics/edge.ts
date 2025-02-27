import type { GEdge, SchemaItem } from '@graph/types'
import { getConnectedNodes } from '@graph/helpers'
import { getLargestAngularSpace } from '@shape/helpers'
import type { BaseGraph } from '@graph/compositions/useBaseGraph'
import { GOLDEN_RATIO } from '@utils/math'
import {
  line,
  arrow,
  uturn
} from '@shapes'

const WHITESPACE_BETWEEN_ARROW_TIP_AND_NODE = 2

type PropsNeededFromGraph = 'edges' | 'getNode' | 'getEdge' | 'getTheme' | 'settings'

export const getEdgeSchematic = (
  edge: GEdge,
  graph: Pick<BaseGraph, PropsNeededFromGraph>,
): Omit<SchemaItem, 'priority'> | undefined => {


  const { displayEdgeLabels, isGraphDirected } = graph.settings.value

  const [from, to] = getConnectedNodes(edge.id, graph)

  const isThereAnEdgeGoingTheOtherWay = graph.edges.value.some(e => e.from === to.id && e.to === from.id)
  const isSelfDirected = to === from

  const fromNodeBorderWidth = graph.getTheme('nodeBorderWidth', from)
  const toNodeBorderWidth = graph.getTheme('nodeBorderWidth', to)

  const fromNodeSize = graph.getTheme('nodeSize', from)
  const toNodeSize = graph.getTheme('nodeSize', to)

  const angle = Math.atan2(to.y - from.y, to.x - from.x);

  const arrowHeadSpacingAwayFromNode = (toNodeBorderWidth / 2) + WHITESPACE_BETWEEN_ARROW_TIP_AND_NODE
  const arrowDrawLocation = {
    x: to.x - (toNodeSize + arrowHeadSpacingAwayFromNode) * Math.cos(angle),
    y: to.y - (toNodeSize + arrowHeadSpacingAwayFromNode) * Math.sin(angle),
  }

  const edgeStart = { x: from.x, y: from.y }
  const edgeEnd = arrowDrawLocation

  const edgeWidth = graph.getTheme('edgeWidth', edge)

  /**
   * the number of pixels we space out the edges if there are multiple edges
   * in a path between two nodes
   */
  const bidirectionalEdgeSpacing = edgeWidth * 1.2

  if (isThereAnEdgeGoingTheOtherWay) {
    edgeStart.x += Math.cos(angle + Math.PI / 2) * bidirectionalEdgeSpacing
    edgeStart.y += Math.sin(angle + Math.PI / 2) * bidirectionalEdgeSpacing

    edgeEnd.x += Math.cos(angle + Math.PI / 2) * bidirectionalEdgeSpacing
    edgeEnd.y += Math.sin(angle + Math.PI / 2) * bidirectionalEdgeSpacing
  }

  const largestAngularSpace = getLargestAngularSpace(
    edgeStart,
    /**
     * 1. Filter to remove self-referencing edge
     * 2. Map to convert to { x, y } format
     * 3. Filter to remove duplicates. Prevents bi-directional edges
     *  from causing angle issues when no other edges are present
     */
    graph.edges.value
      .filter((e) => (e.from === from.id || e.to === to.id) && e.from !== e.to)
      .map((e) => {
        const [fromNode, toNode] = getConnectedNodes(e.id, graph)
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
    activeColor: graphBgColor,
    text: {
      content: edge.label,
      color: edgeTextColor,
      fontSize: edgeTextSize,
      fontWeight: edgeTextFontWeight,
    }
  }

  const textArea = displayEdgeLabels ? textAreaOnEdge : undefined

  const upDistance = (fromNodeSize + fromNodeBorderWidth) * GOLDEN_RATIO;
  const downDistance = upDistance - (fromNodeSize + fromNodeBorderWidth / 2) - WHITESPACE_BETWEEN_ARROW_TIP_AND_NODE;

  if (isSelfDirected) {
    const shape = uturn({
      spacing: edgeWidth * 1.2,
      at: { x: from.x, y: from.y },
      upDistance,
      downDistance,
      rotation: largestAngularSpace,
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

  // prevents edges from rendering if the connecting nodes are touching
  if (areNodesTouching) return

  if (!isGraphDirected) {
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

  const edgeTextAdjustment = fromNodeSize >= 50 ? 0.9 : (fromNodeSize >= 25 ? 1 : 1.3)

  const shape = arrow({
    start: edgeStart,
    end: edgeEnd,
    width: edgeWidth,
    textOffsetFromCenter: fromNodeSize ** edgeTextAdjustment,
    color,
    textArea,
  })

  return {
    shape,
    id: edge.id,
    graphType: 'edge',
  }
}