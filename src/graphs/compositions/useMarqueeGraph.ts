import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { Circle, Line, Rectangle } from '@shape/types'
import type { Aggregator, GEdge, GNode, RectangleSchemaItem, SchemaItem } from '@graph/types'
import colors from '@colors'
import { useNodeAnchorGraph, type NodeAnchorGraphOptions } from './useNodeAnchorGraph'
import { drawCircleWithCtx } from '@shape/draw/circle'

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

  graph.subscribe('onMouseDown', (event) => {
    const { offsetX: x, offsetY: y } = event
    const [topItem] = graph.getDrawItemsByCoordinates(x, y)
    if (topItem) return

    graph.themeMap.nodeAnchorColor.push({
      useThemeId: 'use-marquee-graph',
      value: colors.TRANSPARENT,
    })

    selectionBox.value = { topLeft: { x, y }, bottomRight: { x, y } }
  })

  graph.subscribe('onMouseUp', () => {
    selectionBox.value = undefined
    graph.themeMap.nodeAnchorColor.filter(({ useThemeId }) => useThemeId !== 'use-marquee-graph')
  })

  graph.subscribe('onMouseMove', (event) => {
    if (!selectionBox.value) return
    const { offsetX: x, offsetY: y } = event
    selectionBox.value.bottomRight = { x, y }
  })

  const sampledPoints = new Set<{ x: number, y: number }>()
  const marqueedItems = new Set<GNode | GEdge>()

  const updateSelectedItems = () => {

    const SAMPLING_RATE = 20;

    if (!selectionBox.value) return

    sampledPoints.clear()
    marqueedItems.clear()

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

        if (topItem.graphType === 'node') {
          const node = graph.getNode(topItem.id)
          if (node) marqueedItems.add(node)
        } else if (topItem.graphType === 'edge') {
          const edge = graph.getEdge(topItem.id)
          if (edge) marqueedItems.add(edge)
        }
      }
    }
  }

  graph.subscribe('onRepaint', (ctx) => {
    if (!selectionBox.value) return
    for (const { x, y } of sampledPoints) {
      drawCircleWithCtx(ctx)({
        at: { x, y },
        radius: 1,
        color: colors.WHITE + '10',
      })
    }
  })

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

  const decorateMarqueedItems = (aggregator: Aggregator) => {
    return aggregator.map((item) => {
      if (item.graphType !== 'node' && item.graphType !== 'edge') {
        return item;
      }

      const nodeItem = graph.getNode(item.id)
      if (nodeItem && marqueedItems.has(nodeItem)) {
        (item.schema as Circle).color = colors.BLUE_800;
        return item;
      }

      const edgeItem = graph.getEdge(item.id)
      if (edgeItem && marqueedItems.has(edgeItem)) {
        (item.schema as Line).color = colors.BLUE_800;
        return item;
      }

      return item;
    })
  }

  graph.updateAggregator.push(decorateMarqueedItems)

  return {
    ...graph,
    selectionBox,
    marqueedItems,
  }
}