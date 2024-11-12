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

  const { THEME_ID } = MARQUEE_CONSTANTS

  const selectionBox = ref<BoundingBox | undefined>()

  const selectedArea = ref<BoundingBox | undefined>()
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

  const clearSelection = () => {
    marqueedItemIDs.clear()
    selectedArea.value = undefined
  }

  const marqueeMouseDown = (event: MouseEvent) => {
    lastMove.x = event.offsetX
    lastMove.y = event.offsetY
    const { offsetX: x, offsetY: y } = event
    const topItem = graph.getSchemaItemsByCoordinates(x, y).pop()
    if (!topItem) return engageSelectionBox({ x, y })
  }

  const lastMove = { x: 0, y: 0 }
  const mouseHeldDown = ref(false)

  graph.subscribe('onMouseDown', () => mouseHeldDown.value = true)
  graph.subscribe('onMouseUp', () => mouseHeldDown.value = false)

  const marqueeMouseMove = (event: MouseEvent) => {
    if (selectionBox.value) return;
    if (!mouseHeldDown.value) return
    const { offsetX: x, offsetY: y } = event
    const dx = x - lastMove.x
    const dy = y - lastMove.y
    lastMove.x = x
    lastMove.y = y
    const topItem = graph.getSchemaItemsByCoordinates(x, y).pop()
    if (topItem?.graphType === 'marquee-selection-area') {
      // take all nodes inside of the marquee and move them
      for (const id of marqueedItemIDs) {
        const node = graph.getNode(id)
        if (!node) continue
        graph.moveNode(node.id, {
          x: node.x + dx,
          y: node.y + dy
        })
      }
    }
    workOutSelectedArea()
  }

  const engageSelectionBox = (coords: { x: number, y: number }) => {
    const { x, y } = coords
    const items = graph.getSchemaItemsByCoordinates(x, y)
    if (items.length > 0) return
    hideNodeAnchors()
    selectionBox.value = {
      at: coords,
      width: 0,
      height: 0,
    }
    selectedArea.value = {
      at: { x: Infinity, y: Infinity },
      width: 0,
      height: 0,
    }
  }

  const disengageSelectionBox = () => {
    if (!selectionBox.value) return
    const surfaceArea = getSelectionBoxSurfaceArea(selectionBox.value)
    if (surfaceArea > 200) disableNodeCreationNextTick()
    selectionBox.value = undefined
    graph.repaint('marquee-graph/disengage-selection-box')()
    setTimeout(showNodeAnchors, 100)
  }

  const updateSelectedItems = (box: BoundingBox) => {
    const surfaceArea = getSelectionBoxSurfaceArea(box)
    if (surfaceArea < 100) return
    marqueedItemIDs.clear()

    for (const { id, shape, graphType } of graph.aggregator.value) {
      const { marqueeSelectableGraphTypes } = graph.settings.value
      if (!marqueeSelectableGraphTypes.includes(graphType)) continue
      const inSelectionBox = shape.efficientHitbox(box)
      if (inSelectionBox) marqueedItemIDs.add(id)
    }

    workOutSelectedArea()
  }

  const workOutSelectedArea = () => {
    if (!selectedArea.value) return;

    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    for (const id of marqueedItemIDs) {
      const node = graph.getNode(id);
      if (!node) continue;

      const nodeRadius = graph.getTheme('nodeSize', node);
      const nodeBorderWidth = graph.getTheme('nodeBorderWidth', node);
      const nodeArea = nodeRadius + (nodeBorderWidth / 2);
      const { x, y } = node;

      minX = Math.min(minX, x - nodeArea);
      minY = Math.min(minY, y - nodeArea);
      maxX = Math.max(maxX, x + nodeArea);
      maxY = Math.max(maxY, y + nodeArea);
    }

    if (minX < Infinity && minY < Infinity && maxX > -Infinity && maxY > -Infinity) {
      selectedArea.value.at.x = minX;
      selectedArea.value.at.y = minY;
      selectedArea.value.width = maxX - minX;
      selectedArea.value.height = maxY - minY;
    } else {
      selectedArea.value.width = 0;
      selectedArea.value.height = 0;
    }
  };


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
      color: graph.getTheme('marqueeSelectionBoxColor'),
      stroke: {
        color: graph.getTheme('marqueeSelectionBoxBorderColor'),
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

  const getSelectionAreaSchema = (box: BoundingBox) => {
    const shape = rect({
      ...box,
      color: colors.AMBER_500 + '33',
      stroke: {
        color: colors.AMBER_500,
        width: 1
      }
    })

    return {
      id: 'marquee-selection-area',
      graphType: 'marquee-selection-area',
      shape,
      priority: Infinity,
    } as const
  }

  const addSelectionAreaToAggregator = (aggregator: Aggregator) => {
    if (!selectedArea.value) return aggregator
    const selectionAreaSchemaItem = getSelectionAreaSchema(selectedArea.value)
    aggregator.push(selectionAreaSchemaItem)
    return aggregator
  }

  graph.updateAggregator.push(addSelectionBoxToAggregator)
  graph.updateAggregator.push(addSelectionAreaToAggregator)

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

  graph.subscribe('onMouseDown', (ev) => {
    if (selectionBox.value) return
    const { offsetX: x, offsetY: y } = ev
    const topItem = graph.getSchemaItemsByCoordinates(x, y).pop()
    if (!topItem || topItem.graphType !== 'marquee-selection-area') {
      clearSelection()
    }
  })

  const activate = () => {
    graph.subscribe('onMouseDown', marqueeMouseDown)
    graph.subscribe('onMouseMove', marqueeMouseMove)
    graph.subscribe('onMouseUp', disengageSelectionBox)
    graph.subscribe('onContextMenu', disengageSelectionBox)
    graph.subscribe('onMouseMove', updateSelectionBoxDimensions)
  }

  const deactivate = () => {
    graph.unsubscribe('onMouseDown', marqueeMouseDown)
    graph.unsubscribe('onMouseMove', marqueeMouseMove)
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
    /**
     * clears the marquee selection
     */
    clearMarqueeSelection: clearSelection,
  }
}