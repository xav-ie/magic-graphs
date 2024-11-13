import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import type {
  GEdge,
  GNode,
  Aggregator,
  GraphOptions,
  SchemaItem,
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
  const graph = useNodeAnchorGraph(canvas, options)

  const marqueeBox = ref<BoundingBox | undefined>()
  const encapsulatedNodeBox = ref<BoundingBox | undefined>()

  const marqueeSelectedItems = ref(new Set<string>())

  const marqueeSelectedNodes = computed(() => {
    return Array.from(marqueeSelectedItems.value)
      .map((id) => graph.getNode(id))
      .filter((node): node is GNode => !!node)
  })

  const marqueeSelectedEdges = computed(() => {
    return Array.from(marqueeSelectedItems.value)
      .map((id) => graph.getEdge(id))
      .filter((edge): edge is GEdge => !!edge)
  })

  const groupDragCoordinates = ref<{ x: number, y: number } | undefined>()

  const { setTheme, removeTheme } = useTheme(graph, MARQUEE_CONSTANTS.THEME_ID)

  const hideNodeAnchors = () => setTheme('nodeAnchorColor', colors.TRANSPARENT)
  const showNodeAnchors = () => removeTheme('nodeAnchorColor')

  const getSurfaceArea = (box: BoundingBox) => {
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

  /**
   * resets the state of the marquee which includes clearing marquee selected items
   * and dismissing the encapsulated node box
   */
  const clearMarqueeSelection = () => {
    marqueeSelectedItems.value.clear()
    updateEncapsulatedNodeBox()
    encapsulatedNodeBox.value = undefined
    showNodeAnchors()
  }

  /**
   * given a mouse event, engages or disengages the marquee box
   */
  const handleMarqueeEngagement = (event: MouseEvent) => {
    const { offsetX: x, offsetY: y } = event
    const topItem = graph.getSchemaItemsByCoordinates(x, y).pop()
    if (topItem?.graphType !== 'encapsulated-node-box') clearMarqueeSelection()
    if (!topItem) engageMarqueeBox({ x, y })
  }

  const groupDrag = (event: MouseEvent) => {
    if (!groupDragCoordinates.value) return;
    const { offsetX: x, offsetY: y } = event
    const topItem = graph.getSchemaItemsByCoordinates(x, y).pop()
    if (topItem?.graphType !== 'encapsulated-node-box') return
    const dx = x - groupDragCoordinates.value.x
    const dy = y - groupDragCoordinates.value.y
    groupDragCoordinates.value = { x, y }
    for (const id of marqueeSelectedItems.value) {
      const node = graph.getNode(id)
      if (!node) continue
      graph.moveNode(node.id, {
        x: node.x + dx,
        y: node.y + dy
      })
    }
    updateEncapsulatedNodeBox()
  }

  const beginGroupDrag = (event: MouseEvent) => {
    if (marqueeBox.value) return
    const { offsetX: x, offsetY: y } = event
    const topItem = graph.getSchemaItemsByCoordinates(x, y).pop()
    if (topItem?.graphType !== 'encapsulated-node-box') return
    groupDragCoordinates.value = { x, y }
    graph.emit('onGroupDragStart', marqueeSelectedNodes.value, { x, y })
  }

  const groupDrop = () => {
    if (!groupDragCoordinates.value) return
    graph.emit('onGroupDrop', marqueeSelectedNodes.value, groupDragCoordinates.value)
    groupDragCoordinates.value = undefined
  }

  const initializeEncapsulatedNodeBox = () => encapsulatedNodeBox.value = {
    at: { x: Infinity, y: Infinity },
    width: 0,
    height: 0,
  }

  const engageMarqueeBox = (startingCoords: { x: number, y: number }) => {
    hideNodeAnchors()
    marqueeBox.value = {
      at: startingCoords,
      width: 0,
      height: 0,
    }
    initializeEncapsulatedNodeBox()
  }

  const disengageMarqueeBox = () => {
    if (!marqueeBox.value) return
    const surfaceArea = getSurfaceArea(marqueeBox.value)
    if (surfaceArea > 200) disableNodeCreationNextTick()
    marqueeBox.value = undefined
    graph.repaint('marquee-graph/disengage-marquee-box')()
  }

  const updateMarqueeSelectedItems = (box: BoundingBox) => {
    const surfaceArea = getSurfaceArea(box)
    if (surfaceArea < 100) return
    marqueeSelectedItems.value.clear()

    for (const { id, shape, graphType } of graph.aggregator.value) {
      const { marqueeSelectableGraphTypes } = graph.settings.value
      if (!marqueeSelectableGraphTypes.includes(graphType)) continue
      const inSelectionBox = shape.efficientHitbox(box)
      if (inSelectionBox) marqueeSelectedItems.value.add(id)
    }

    updateEncapsulatedNodeBox()
  }

  const updateEncapsulatedNodeBox = () => {
    if (!encapsulatedNodeBox.value) return

    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    for (const id of marqueeSelectedItems.value) {
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
      encapsulatedNodeBox.value.at.x = minX;
      encapsulatedNodeBox.value.at.y = minY;
      encapsulatedNodeBox.value.width = maxX - minX;
      encapsulatedNodeBox.value.height = maxY - minY;
    } else {
      encapsulatedNodeBox.value.width = 0;
      encapsulatedNodeBox.value.height = 0;
    }

    graph.repaint('marquee-graph/update-encapsulated-node-box')()
  };

  const setMarqueeBoxDimensions = (event: MouseEvent) => {
    if (!marqueeBox.value) return
    const { offsetX: x, offsetY: y } = event
    marqueeBox.value.width = x - marqueeBox.value.at.x
    marqueeBox.value.height = y - marqueeBox.value.at.y
    updateMarqueeSelectedItems(marqueeBox.value)
    graph.repaint('marquee-graph/update-selection-box')()
  }

  const getMarqueeBoxSchema = (box: BoundingBox) => {
    const shape = rect({
      ...box,
      color: graph.getTheme('marqueeSelectionBoxColor'),
      stroke: {
        color: graph.getTheme('marqueeSelectionBoxBorderColor'),
        width: 2,
      }
    })

    return {
      id: 'marquee-box',
      graphType: 'marquee-box',
      shape,
      priority: Infinity,
    } as const
  }

  const addMarqueeBoxToAggregator = (aggregator: Aggregator) => {
    if (!marqueeBox.value) return aggregator
    const selectionBoxSchemaItem = getMarqueeBoxSchema(marqueeBox.value)
    aggregator.push(selectionBoxSchemaItem)
    return aggregator
  }

  const getEncapsulatedNodeBoxSchema = (box: BoundingBox) => {
    const shape = rect({
      ...box,
      color: graph.getTheme('marqueeEncapsulatedNodeBoxColor'),
      stroke: {
        color: graph.getTheme('marqueeEncapsulatedNodeBoxBorderColor'),
        width: 2,
      }
    })

    return {
      id: 'encapsulated-node-box',
      graphType: 'encapsulated-node-box',
      shape,
      priority: Infinity,
    } as const
  }

  const addEncapsulatedNodeBoxToAggregator = (aggregator: Aggregator) => {
    if (!encapsulatedNodeBox.value) return aggregator
    const selectionAreaSchemaItem = getEncapsulatedNodeBoxSchema(encapsulatedNodeBox.value)
    aggregator.push(selectionAreaSchemaItem)
    return aggregator
  }

  graph.updateAggregator.push(addMarqueeBoxToAggregator)
  graph.updateAggregator.push(addEncapsulatedNodeBoxToAggregator)

  const colorMarqueeSelectedNodes = (node: GNode) => {
    const isMarqueed = marqueeSelectedItems.value.has(node.id)
    if (isMarqueed) return getValue(graph.theme.value.nodeFocusColor, node)
  }

  const colorMarqueeSelectedNodeBorders = (node: GNode) => {
    const isMarqueed = marqueeSelectedItems.value.has(node.id)
    if (isMarqueed) return getValue(graph.theme.value.nodeFocusBorderColor, node)
  }

  const colorMarqueeSelectedNodeText = (node: GNode) => {
    const isMarqueed = marqueeSelectedItems.value.has(node.id)
    if (isMarqueed) return getValue(graph.theme.value.nodeFocusTextColor, node)
  }

  const colorMarqueeSelectedEdges = (edge: GEdge) => {
    const isMarqueed = marqueeSelectedItems.value.has(edge.id)
    if (isMarqueed) return getValue(graph.theme.value.edgeFocusColor, edge)
  }

  const colorMarqueeSelectedEdgeText = (edge: GEdge) => {
    const isMarqueed = marqueeSelectedItems.value.has(edge.id)
    if (isMarqueed) return getValue(graph.theme.value.edgeFocusTextColor, edge)
  }

  setTheme('nodeColor', colorMarqueeSelectedNodes)
  setTheme('nodeBorderColor', colorMarqueeSelectedNodeBorders)
  setTheme('nodeTextColor', colorMarqueeSelectedNodeText)

  setTheme('edgeColor', colorMarqueeSelectedEdges)
  setTheme('edgeTextColor', colorMarqueeSelectedEdgeText)

  onClickOutside(canvas, () => clearMarqueeSelection())

  /**
   * takes a list of item ids and creates a marquee selection around them
   */
  const setMarqueeSelectedItems = (itemIds: string[]) => {
    marqueeSelectedItems.value = new Set(itemIds)
    initializeEncapsulatedNodeBox()
    updateEncapsulatedNodeBox()
  }

  const activate = () => {
    graph.subscribe('onMouseDown', handleMarqueeEngagement)
    graph.subscribe('onMouseUp', disengageMarqueeBox)
    graph.subscribe('onNodeMoved', updateEncapsulatedNodeBox)
    graph.subscribe('onContextMenu', disengageMarqueeBox)
    graph.subscribe('onMouseMove', setMarqueeBoxDimensions)

    graph.subscribe('onMouseDown', beginGroupDrag)
    graph.subscribe('onMouseUp', groupDrop)
    graph.subscribe('onMouseMove', groupDrag)
  }

  const deactivate = () => {
    graph.unsubscribe('onMouseDown', handleMarqueeEngagement)
    graph.unsubscribe('onMouseUp', disengageMarqueeBox)
    graph.unsubscribe('onNodeMoved', updateEncapsulatedNodeBox)
    graph.unsubscribe('onContextMenu', disengageMarqueeBox)
    graph.unsubscribe('onMouseMove', setMarqueeBoxDimensions)

    graph.unsubscribe('onMouseDown', beginGroupDrag)
    graph.unsubscribe('onMouseUp', groupDrop)
    graph.unsubscribe('onMouseMove', groupDrag)

    if (marqueeBox.value) disengageMarqueeBox()
  }

  graph.subscribe('onSettingsChange', (diff) => {
    if (diff.marquee === true) activate()
    else if (diff.marquee === false) deactivate()
  })

  if (graph.settings.value.marquee) activate()

  return {
    ...graph,

    /**
     * a set containing the ids of all items in the current marquee selection
     */
    marqueeSelectedItems,

    /**
     * @param itemId a node or edge id
     * @returns true if the item is marquee-selected or focused
     */
    isHighlighted: (itemId: string) => (
      marqueeSelectedItems.value.has(itemId) ||
      graph.focusedItemId.value === itemId
    ),

    setMarqueeSelectedItems,
    clearMarqueeSelection,

    /**
     * a computed array of all nodes in the current marquee selection
     */
    marqueeSelectedNodes,
    /**
     * a computed array of all edges in the current marquee selection
     */
    marqueeSelectedEdges,
  }
}