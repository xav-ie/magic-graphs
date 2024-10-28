import { ref } from 'vue'
import type { Ref } from 'vue'
import type { Circle, Rectangle } from '@shape/types'
import type { Aggregator, GNode, RectangleSchemaItem } from '@graph/types'
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
  const preservedNodeAnchorSettingsState = ref(graph.settings.value.nodeAnchors)

  graph.subscribe('onMouseDown', (event) => {
    const { offsetX: x, offsetY: y } = event
    const [topItem] = graph.getDrawItemsByCoordinates(x, y)
    if (topItem) return
    preservedNodeAnchorSettingsState.value = graph.settings.value.nodeAnchors
    graph.settings.value.nodeAnchors = false
    selectionBox.value = { topLeft: { x, y }, bottomRight: { x, y } }
  })

  graph.subscribe('onMouseUp', () => {
    selectionBox.value = undefined
    graph.settings.value.nodeAnchors = preservedNodeAnchorSettingsState.value
  })

  graph.subscribe('onMouseMove', (event) => {
    if (!selectionBox.value) return
    const { offsetX: x, offsetY: y } = event
    selectionBox.value.bottomRight = { x, y }
  })

  const samplingPoints = new Set<{ x: number, y: number }>()
  const itemIDs = new Set<GNode['id']>()

  const updateSelectedItems = () => {

    const SAMPLING_RATE = 20;

    if (!selectionBox.value) return itemIDs

    samplingPoints.clear()
    itemIDs.clear()

    const { topLeft, bottomRight } = selectionBox.value
    const x1 = Math.min(topLeft.x, bottomRight.x)
    const x2 = Math.max(topLeft.x, bottomRight.x)
    const y1 = Math.min(topLeft.y, bottomRight.y)
    const y2 = Math.max(topLeft.y, bottomRight.y)

    for (let x = x1 + 10; x < x2; x += SAMPLING_RATE) {
      for (let y = y1 + 10; y < y2; y += SAMPLING_RATE) {
        const [topItem] = graph.getDrawItemsByCoordinates(x, y)
        samplingPoints.add({ x, y })
        if (!topItem) continue
        if (topItem.graphType === 'node' || topItem.graphType === 'edge') {
          itemIDs.add(topItem.id)
        }
      }
    }

    return itemIDs
  }

  graph.subscribe('onRepaint', (ctx) => {
    if (!selectionBox.value) return
    for (const { x, y } of samplingPoints) {
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

  const decorateSelectedItems = (aggregator: Aggregator) => {
    return aggregator.map((item) => {
      if (item.graphType !== 'node' && item.graphType !== 'edge') {
        return item;
      }

      if (!itemIDs.has(item.id)) {
        return item;
      }

      (item.schema as Circle).color = colors.BLUE_800;

      return item
    })
  }

  graph.updateAggregator.push(decorateSelectedItems)

  return graph
}