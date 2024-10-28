import { ref } from 'vue'
import type { Ref } from 'vue'
import type { Rectangle } from '@shape/types'
import type { RectangleSchemaItem } from '@graph/types'
import colors from '@colors'
import { useNodeAnchorGraph, type NodeAnchorGraphOptions } from './useNodeAnchorGraph'

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
    const node = graph.getNodeByCoordinates(x, y)
    if (node) return
    preservedNodeAnchorSettingsState.value = graph.settings.value.nodeAnchors
    graph.settings.value.nodeAnchors = false
    selectionBox.value = { topLeft: { x, y }, bottomRight: { x, y } }
  })

  graph.subscribe('onMouseUp', (event) => {
    selectionBox.value = undefined
    graph.settings.value.nodeAnchors = preservedNodeAnchorSettingsState.value
  })

  graph.subscribe('onMouseMove', (event) => {
    if (!selectionBox.value) return
    const { offsetX: x, offsetY: y } = event
    selectionBox.value.bottomRight = { x, y }
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

    aggregator.push(boxSchemaItem)
    return aggregator
  })

  return graph
}