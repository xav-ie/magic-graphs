import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { Circle, Line, Rectangle } from '@shape/types'
import type { Aggregator, GEdge, GNode, RectangleSchemaItem } from '@graph/types'
import { useTheme } from '@graph/themes/useTheme'
import colors, { BLUE_800 } from '@colors'
import { useNodeAnchorGraph, type NodeAnchorGraphOptions } from './useNodeAnchorGraph'
import { drawCircleWithCtx } from '@shape/draw/circle'
import { getValue } from '@graph/helpers'
import { onClickOutside } from '@vueuse/core'

type SelectionBox = {
  topLeft: { x: number; y: number }
  bottomRight: { x: number; y: number }
}

export const useMarqueeGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<NodeAnchorGraphOptions> = {},
) => {

  const selectionBox = ref<SelectionBox | undefined>()
  const graph = useNodeAnchorGraph(canvas, options)

  const { setTheme, removeTheme } = useTheme(graph, 'use-marquee-graph')

  graph.subscribe('onMouseDown', (event) => {
    const { offsetX: x, offsetY: y } = event
    const [topItem] = graph.getDrawItemsByCoordinates(x, y)
    if (topItem) return
    setTheme('nodeAnchorColor', colors.TRANSPARENT)
    selectionBox.value = { topLeft: { x, y }, bottomRight: { x, y } }
  })

  graph.subscribe('onMouseUp', () => {
    removeTheme('nodeAnchorColor')
    selectionBox.value = undefined
  })

  graph.subscribe('onMouseMove', (event) => {
    if (!selectionBox.value) return
    const { offsetX: x, offsetY: y } = event
    selectionBox.value.bottomRight = { x, y }
  })

  graph.subscribe('onClick', () => {
    if (!selectionBox.value) return
    selectionBox.value = undefined
    removeTheme('nodeAnchorColor')
  })

  const sampledPoints = new Set<{ x: number, y: number }>()
  const marqueedItemIDs = new Set<string>()

  const updateSelectedItems = () => {

    const SAMPLING_RATE = 20;

    if (!selectionBox.value) return

    sampledPoints.clear()
    marqueedItemIDs.clear()

    const { topLeft, bottomRight } = selectionBox.value
    const x1 = Math.min(topLeft.x, bottomRight.x)
    const x2 = Math.max(topLeft.x, bottomRight.x)
    const y1 = Math.min(topLeft.y, bottomRight.y)
    const y2 = Math.max(topLeft.y, bottomRight.y)

    for (let x = x1 + (SAMPLING_RATE / 2); x < x2; x += SAMPLING_RATE) {
      for (let y = y1 + (SAMPLING_RATE / 2); y < y2; y += SAMPLING_RATE) {
        sampledPoints.add({ x, y })

        const [topItem] = graph.getDrawItemsByCoordinates(x, y)
        if (!topItem) continue

        const marqueeableTypes = ['node', 'edge'] as const
        const isMarqueeable = marqueeableTypes.some(type => topItem.graphType === type)
        if (isMarqueeable) marqueedItemIDs.add(topItem.id)
      }
    }
  }

  const drawSampledPoints = (ctx: CanvasRenderingContext2D) => {
    if (!selectionBox.value) return
    for (const { x, y } of sampledPoints) {
      drawCircleWithCtx(ctx)({
        at: { x, y },
        radius: 1,
        color: colors.WHITE + '10',
      })
    }
  }

  graph.subscribe('onRepaint', drawSampledPoints)

  graph.updateAggregator.push((aggregator) => {
    if (!selectionBox.value) return aggregator

    const { topLeft, bottomRight } = selectionBox.value

    const rect: Rectangle = {
      at: {
        x: topLeft.x,
        y: topLeft.y,
      },
      width: bottomRight.x - topLeft.x,
      height: bottomRight.y - topLeft.y,
      color: colors.WHITE + '10',
      stroke: {
        color: colors.WHITE,
        width: 1,
      }
    }

    const boxSchemaItem: RectangleSchemaItem = {
      id: 'selection-box',
      schemaType: 'rect',
      graphType: 'selection-box',
      schema: rect,
      priority: Infinity,
    }

    updateSelectedItems()

    aggregator.push(boxSchemaItem)
    return aggregator
  })

  const colorMarqueedNodes = (node: GNode) => {
    const isMarqueed =marqueedItemIDs.has(node.id)
    const defaultColor = graph.theme.value.nodeColor
    const focusColor = graph.theme.value.nodeFocusColor
    return getValue(isMarqueed ? focusColor : defaultColor, node)
  }

  const colorMarqueedNodeBorders = (node: GNode) => {
    const isMarqueed = marqueedItemIDs.has(node.id)
    const defaultColor = graph.theme.value.nodeBorderColor
    const focusColor = graph.theme.value.nodeFocusBorderColor
    return getValue(isMarqueed ? focusColor : defaultColor, node)
  }

  const colorMarqueedEdges = (edge: GEdge) => {
    const isMarqueed = marqueedItemIDs.has(edge.id)
    const defaultColor = graph.theme.value.edgeColor
    const focusColor = graph.theme.value.edgeFocusColor
    return getValue(isMarqueed ? focusColor : defaultColor, edge)
  }

  setTheme('nodeColor', colorMarqueedNodes)
  setTheme('nodeBorderColor', colorMarqueedNodeBorders)

  setTheme('edgeColor', colorMarqueedEdges)

  onClickOutside(canvas, () => {
    marqueedItemIDs.clear()
  })

  return {
    ...graph,
    selectionBox,
    marqueedItemIDs,
  }
}