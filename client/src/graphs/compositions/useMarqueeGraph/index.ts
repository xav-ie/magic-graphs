import { ref } from 'vue'
import type { Ref } from 'vue'
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
import colors from '@colors'
import { rect } from '@shapes'
import type { BoundingBox, Coordinate } from "@shape/types";
import type {
  HistoryRecord,
  RedoHistoryOptions,
  UndoHistoryOptions
} from '../useHistoryGraph/types'
import type { GraphMouseEvent } from '../useBaseGraph/types'

export const useMarqueeGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<GraphOptions> = {},
) => {
  const graph = useNodeAnchorGraph(canvas, options)

  const marqueeBox = ref<BoundingBox | undefined>()
  const encapsulatedNodeBox = ref<BoundingBox | undefined>()

  const groupDragCoordinates = ref<Coordinate | undefined>()

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
   * given a mouse event, engages or disengages the marquee box
   */
  const handleMarqueeEngagement = ({ items, coords }: GraphMouseEvent) => {
    const topItem = items.at(-1)
    if (topItem?.graphType !== 'encapsulated-node-box') showNodeAnchors()
    if (!topItem) engageMarqueeBox(coords)
  }

  const groupDrag = ({ items, coords }: GraphMouseEvent) => {
    if (!groupDragCoordinates.value) return;
    const topItem = items.at(-1)
    if (topItem?.graphType !== 'encapsulated-node-box') return
    const dx = coords.x - groupDragCoordinates.value.x
    const dy = coords.y - groupDragCoordinates.value.y
    groupDragCoordinates.value = coords
    for (const node of graph.focusedNodes.value) {
      graph.moveNode(node.id, {
        x: node.x + dx,
        y: node.y + dy
      })
    }
    updateEncapsulatedNodeBox()
  }

  const beginGroupDrag = ({ items, coords }: GraphMouseEvent) => {
    if (marqueeBox.value) return
    const topItem = items.at(-1)
    if (topItem?.graphType !== 'encapsulated-node-box') return
    groupDragCoordinates.value = coords
    graph.emit('onGroupDragStart', graph.focusedNodes.value, coords)
  }

  const groupDrop = () => {
    if (!groupDragCoordinates.value) return
    graph.emit('onGroupDrop', graph.focusedNodes.value, groupDragCoordinates.value)
    groupDragCoordinates.value = undefined
  }

  const initializeEncapsulatedNodeBox = () => encapsulatedNodeBox.value = {
    at: { x: Infinity, y: Infinity },
    width: 0,
    height: 0,
  }

  const engageMarqueeBox = (startingCoords: { x: number, y: number }) => {
    hideNodeAnchors()
    graph.graphCursorDisabled.value = true
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
    graph.graphCursorDisabled.value = false
    showNodeAnchors()
  }

  const updateMarqueeSelectedItems = (box: BoundingBox) => {
    const surfaceArea = getSurfaceArea(box)
    if (surfaceArea < 100) return
    const targetedItems: string[] = []

    for (const { id, shape, graphType } of graph.aggregator.value) {
      const { marqueeSelectableGraphTypes } = graph.settings.value
      if (!marqueeSelectableGraphTypes.includes(graphType)) continue
      const inSelectionBox = shape.efficientHitbox(box)
      if (inSelectionBox) targetedItems.push(id)
    }

    graph.setFocus(targetedItems)
  }

  const updateEncapsulatedNodeBox = () => {
    if (!encapsulatedNodeBox.value) return
    if (graph.focusedNodes.value.length < 2) return initializeEncapsulatedNodeBox()

    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    for (const node of graph.focusedNodes.value) {
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
  };

  const setMarqueeBoxDimensions = ({ coords }: GraphMouseEvent) => {
    if (!marqueeBox.value) return
    const { x, y } = coords
    marqueeBox.value.width = x - marqueeBox.value.at.x
    marqueeBox.value.height = y - marqueeBox.value.at.y
    updateMarqueeSelectedItems(marqueeBox.value)
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

  graph.updateAggregator.push(addEncapsulatedNodeBoxToAggregator)
  graph.updateAggregator.push(addMarqueeBoxToAggregator)


  const activate = () => {
    graph.subscribe('onFocusChange', updateEncapsulatedNodeBox)

    graph.subscribe('onMouseDown', handleMarqueeEngagement)
    graph.subscribe('onMouseUp', disengageMarqueeBox)
    graph.subscribe('onContextMenu', disengageMarqueeBox)
    graph.subscribe('onMouseMove', setMarqueeBoxDimensions)

    graph.subscribe('onMouseDown', beginGroupDrag)
    graph.subscribe('onMouseUp', groupDrop)
    graph.subscribe('onMouseMove', groupDrag)

    graph.subscribe('onUndo', updateEncapsulatedNodeBox)
    graph.subscribe('onRedo', updateEncapsulatedNodeBox)
  }

  const deactivate = () => {
    graph.unsubscribe('onFocusChange', updateEncapsulatedNodeBox)

    graph.unsubscribe('onMouseDown', handleMarqueeEngagement)
    graph.unsubscribe('onMouseUp', disengageMarqueeBox)
    graph.unsubscribe('onContextMenu', disengageMarqueeBox)
    graph.unsubscribe('onMouseMove', setMarqueeBoxDimensions)

    graph.unsubscribe('onMouseDown', beginGroupDrag)
    graph.unsubscribe('onMouseUp', groupDrop)
    graph.unsubscribe('onMouseMove', groupDrag)

    graph.unsubscribe('onUndo', updateEncapsulatedNodeBox)
    graph.unsubscribe('onRedo', updateEncapsulatedNodeBox)

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
     * updates the bounding box around the nodes that are currently focused.
     * use this when you are changing theme or position outside of the standard supported use cases
     */
    updateEncapsulatedNodeBox,
  }
}