import { ref } from 'vue'
import type { Ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import type {
  GEdge,
  GNode,
  SchemaItem,
  Aggregator,
  GraphOptions,
} from '@graph/types'
import { useTheme } from '@graph/themes/useTheme'
import { useNodeAnchorGraph } from '@graph/compositions/useNodeAnchorGraph'
import type { SelectionBox } from '@graph/compositions/useMarqueeGraphTypes'
import { MARQUEE_CONSTANTS } from '@graph/compositions/useMarqueeGraphTypes'
import { getValue } from '@graph/helpers'
import colors from '@colors'
import { rect } from '@shapes'

export const useMarqueeGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<GraphOptions> = {},
) => {

  const {
    THEME_ID,
    SELECTABLE_GRAPH_TYPES,
    SAMPLING_RATE,
    SELECTION_BORDER_COLOR,
    SELECTION_BG_COLOR,
  } = MARQUEE_CONSTANTS

  const selectionBox = ref<SelectionBox | undefined>()
  const graph = useNodeAnchorGraph(canvas, options)

  const marqueedItemIDs = new Set<string>()

  const { setTheme, removeTheme } = useTheme(graph, THEME_ID)

  const hideNodeAnchors = () => setTheme('nodeAnchorColor', colors.TRANSPARENT)
  const showNodeAnchors = () => removeTheme('nodeAnchorColor')

  const getSelectionBoxProps = (box: SelectionBox) => {
    const { at, width, height } = box
    const x1 = Math.min(at.x, at.x + width)
    const x2 = Math.max(at.x, at.x + width)
    const y1 = Math.min(at.y, at.y + height)
    const y2 = Math.max(at.y, at.y + height)
    const surfaceArea = Math.abs(width * height)
    return { x1, x2, y1, y2, surfaceArea }
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
    const { surfaceArea } = getSelectionBoxProps(selectionBox.value)
    if (surfaceArea > 200) disableNodeCreationNextTick()
    selectionBox.value = undefined
    coordinateCache.clear()
    showNodeAnchors()
    graph.repaint('marquee-graph/disengage-selection-box')()
  }

  const coordinateCache = new Map<string, SchemaItem | null>()

  const getFromCache = (xInp: number, yInp: number) => {
    const CACHE_BUCKET_SIZE = SAMPLING_RATE / 2
    const x = Math.round(xInp / CACHE_BUCKET_SIZE) * CACHE_BUCKET_SIZE
    const y = Math.round(yInp / CACHE_BUCKET_SIZE) * CACHE_BUCKET_SIZE
    const key = `${x}:${y}`
    const res = coordinateCache.get(key);
    if (res === undefined) {
      const topItem = graph.getSchemaItemsByCoordinates(xInp, yInp).pop()
      coordinateCache.set(key, topItem ?? null)
      return topItem
    }
    return res
  }

  const updateSelectedItems = (box: SelectionBox) => {
    marqueedItemIDs.clear()

    const { x1, x2, y1, y2 } = getSelectionBoxProps(box)

    for (let x = x1; x < x2; x += SAMPLING_RATE) {
      for (let y = y1; y < y2; y += SAMPLING_RATE) {
        const topItem = getFromCache(x, y)
        if (!topItem) continue

        const isMarqueeable = SELECTABLE_GRAPH_TYPES.some(type => topItem.graphType === type)
        if (isMarqueeable) marqueedItemIDs.add(topItem.id)
      }
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

  graph.subscribe('onMouseDown', engageSelectionBox)
  graph.subscribe('onMouseUp', disengageSelectionBox)
  graph.subscribe('onContextMenu', disengageSelectionBox)
  graph.subscribe('onMouseMove', updateSelectionBoxDimensions)

  const getSelectionBoxSchema = (box: SelectionBox) => {
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