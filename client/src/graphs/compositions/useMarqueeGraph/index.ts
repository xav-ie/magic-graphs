import { ref } from 'vue'
import type { Ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import type {
  GEdge,
  GNode,
  Aggregator,
  GraphOptions,
} from '@graph/types'
import { useTheme } from '@graph/themes/useTheme'
import { useNodeAnchorGraph } from '@graph/compositions/useNodeAnchorGraph'
import { MARQUEE_CONSTANTS } from '@graph/compositions/useMarqueeGraph/types'
import { getValue } from '@graph/helpers'
import colors from '@colors'
import { rect } from '@shapes'
import type { BoundingBox } from "@shape/types";

export const useMarqueeGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<GraphOptions> = {},
) => {

  const {
    THEME_ID,
    SELECTABLE_GRAPH_TYPES,
    SELECTION_BORDER_COLOR,
    SELECTION_BG_COLOR,
  } = MARQUEE_CONSTANTS

  const selectionBox = ref<BoundingBox | undefined>()
  const graph = useNodeAnchorGraph(canvas, options)

  const marqueedItemIDs = new Set<string>()

  const { setTheme, removeTheme } = useTheme(graph, THEME_ID)

  const hideNodeAnchors = () => setTheme('nodeAnchorColor', colors.TRANSPARENT)
  const showNodeAnchors = () => removeTheme('nodeAnchorColor')

  const getSelectionBoxSurfaceArea = (box: BoundingBox) => {
    const { width, height } = box
    return Math.abs(width * height)
  }

  const disableNodeCreationNextTick = () => {
    const callbacks = graph.eventBus['onDblClick']

    let nodeCreationFn;
    for (const callback of callbacks) {
      if (callback.name === 'handleNodeCreation') {
        nodeCreationFn = callback
        break
      }
    }

    if (!nodeCreationFn) {
      console.error('Could not find node creation function')
      return
    }

    graph.unsubscribe('onDblClick', nodeCreationFn)
    setTimeout(() => graph.subscribe('onDblClick', nodeCreationFn), 10)
  }

  const engageSelectionBox = (event: MouseEvent) => {
    marqueedItemIDs.clear()
    const { offsetX: x, offsetY: y } = event
    const items = graph.getSchemaItemsByCoordinates(x, y)
    if (items.length > 0) return
    hideNodeAnchors()
    selectionBox.value = {
      at: { x, y },
      width: 0,
      height: 0,
    }
  }

  const disengageSelectionBox = () => {
    if (!selectionBox.value) return
    const surfaceArea = getSelectionBoxSurfaceArea(selectionBox.value)
    if (surfaceArea > 200) disableNodeCreationNextTick()
    selectionBox.value = undefined
    showNodeAnchors()
    graph.repaint('marquee-graph/disengage-selection-box')()
  }

  const updateSelectedItems = (box: BoundingBox) => {
    const surfaceArea = getSelectionBoxSurfaceArea(box)
    if (surfaceArea < 100) return
    marqueedItemIDs.clear()

    for (const { id, shape, graphType } of graph.aggregator.value) {
      if (!SELECTABLE_GRAPH_TYPES.includes(graphType)) continue
      const inSelectionBox = shape.efficientHitbox(box)
      if (inSelectionBox) marqueedItemIDs.add(id)
    }
  }

  const updateSelectionBoxDimensions = (event: MouseEvent) => {
    if (!selectionBox.value) return
    const { offsetX: x, offsetY: y } = event
    selectionBox.value.width = x - selectionBox.value.at.x
    selectionBox.value.height = y - selectionBox.value.at.y
    updateSelectedItems(selectionBox.value)
    graph.repaint('marquee-graph/update-selection-box')()
  }

  const getSelectionBoxSchema = (box: BoundingBox) => {
    const shape = rect({
      ...box,
      color: SELECTION_BG_COLOR,
      stroke: {
        color: SELECTION_BORDER_COLOR,
        width: 1,
      }
    })

    return {
      id: 'marquee-selection-box',
      graphType: 'marquee-selection-box',
      shape,
      priority: Infinity,
    } as const
  }

  const addSelectionBoxToAggregator = (aggregator: Aggregator) => {
    if (!selectionBox.value) return aggregator
    const selectionBoxSchemaItem = getSelectionBoxSchema(selectionBox.value)
    aggregator.push(selectionBoxSchemaItem)
    return aggregator
  }

  graph.updateAggregator.push(addSelectionBoxToAggregator)

  const colorMarqueedNodes = (node: GNode) => {
    const isMarqueed = marqueedItemIDs.has(node.id)
    if (isMarqueed) return getValue(graph.theme.value.nodeFocusColor, node)
  }

  const colorMarqueedNodeBorders = (node: GNode) => {
    const isMarqueed = marqueedItemIDs.has(node.id)
    if (isMarqueed) return getValue(graph.theme.value.nodeFocusBorderColor, node)
  }

  const colorMarqueedEdges = (edge: GEdge) => {
    const isMarqueed = marqueedItemIDs.has(edge.id)
    if (isMarqueed) return getValue(graph.theme.value.edgeFocusColor, edge)
  }

  setTheme('nodeColor', colorMarqueedNodes)
  setTheme('nodeBorderColor', colorMarqueedNodeBorders)

  setTheme('edgeColor', colorMarqueedEdges)

  onClickOutside(canvas, () => marqueedItemIDs.clear())

  const activate = () => {
    graph.subscribe('onMouseDown', engageSelectionBox)
    graph.subscribe('onMouseUp', disengageSelectionBox)
    graph.subscribe('onContextMenu', disengageSelectionBox)
    graph.subscribe('onMouseMove', updateSelectionBoxDimensions)
  }

  const deactivate = () => {
    graph.unsubscribe('onMouseDown', engageSelectionBox)
    graph.unsubscribe('onMouseUp', disengageSelectionBox)
    graph.unsubscribe('onContextMenu', disengageSelectionBox)
    graph.unsubscribe('onMouseMove', updateSelectionBoxDimensions)
    if (selectionBox.value) disengageSelectionBox()
  }

  graph.subscribe('onSettingsChange', (diff) => {
    if (diff.marquee === true) activate()
    else if (diff.marquee === false) deactivate()
  })

  if (graph.settings.value.marquee) activate()

  return {
    ...graph,
    selectionBox,
    marqueedItemIDs,

    /**
     * @param itemId a node or edge id
     * @returns true if the item is marquee-selected or focused
     */
    isHighlighted: (itemId: string) => marqueedItemIDs.has(itemId) || graph.focusedItemId.value === itemId,
  }
}