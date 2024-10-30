import { ref } from 'vue'
import type { Ref } from 'vue'
import { onClickOutside, set } from '@vueuse/core'
import colors from '@colors'
import type {
  GEdge,
  GNode,
  SchemaItem,
  RectangleSchemaItem,
  Aggregator,
} from '@graph/types'
import { useTheme } from '@graph/themes/useTheme'
import { useNodeAnchorGraph } from '@graph/compositions/useNodeAnchorGraph'
import type { NodeAnchorGraphOptions } from '@graph/compositions/useNodeAnchorGraph'
import { getValue } from '@graph/helpers'
import type { Rectangle } from '@shape/types'
import { drawCircleWithCtx } from '@shape/draw/circle'

export type SelectionBox = {
  topLeft: { x: number; y: number }
  bottomRight: { x: number; y: number }
}

const MARQUEE_SELECTABLE_GRAPH_TYPES: SchemaItem['graphType'][] = ['node', 'edge']
const MARQUEE_SAMPLING_RATE = 15;
const MARQUEE_SELECTION_BORDER_COLOR = colors.WHITE
const MARQUEE_SELECTION_BG_COLOR = colors.WHITE + '10'
const MARQUEE_THEME_ID = 'use-marquee-graph'

export const useMarqueeGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<NodeAnchorGraphOptions> = {},
) => {

  const selectionBox = ref<SelectionBox | undefined>()
  const graph = useNodeAnchorGraph(canvas, options)

  // const sampledPoints = new Set<{ x: number, y: number }>()
  const marqueedItemIDs = new Set<string>()

  const { setTheme, removeTheme } = useTheme(graph, MARQUEE_THEME_ID)

  const hideNodeAnchors = () => setTheme('nodeAnchorColor', colors.TRANSPARENT)
  const showNodeAnchors = () => removeTheme('nodeAnchorColor')

  const getSelectionBoxProps = (box: SelectionBox) => {
    const { topLeft, bottomRight } = box
    const x1 = Math.min(topLeft.x, bottomRight.x)
    const x2 = Math.max(topLeft.x, bottomRight.x)
    const y1 = Math.min(topLeft.y, bottomRight.y)
    const y2 = Math.max(topLeft.y, bottomRight.y)
    const surfaceArea = (x2 - x1) * (y2 - y1)
    return { x1, x2, y1, y2, surfaceArea }
  }

  const disableNodeCreationNextTick = () => {
    const callbacks = graph.eventBus['onDblClick']
    const nodeCreationFn = callbacks.find((fn) => fn.name === 'handleNodeCreation')
    if (nodeCreationFn) {
      graph.unsubscribe('onDblClick', nodeCreationFn)
      setTimeout(() => graph.subscribe('onDblClick', nodeCreationFn), 10)
    }
  }

  const engageSelectionBox = (event: MouseEvent) => {
    marqueedItemIDs.clear()
    const { offsetX: x, offsetY: y } = event
    const [topItem] = graph.getDrawItemsByCoordinates(x, y)
    if (topItem) return
    hideNodeAnchors()
    selectionBox.value = {
      topLeft: { x, y },
      bottomRight: { x, y }
    }
  }

  const disengageSelectionBox = () => {
    if (!selectionBox.value) return
    const { surfaceArea } = getSelectionBoxProps(selectionBox.value)
    if (surfaceArea > 200) disableNodeCreationNextTick()
    selectionBox.value = undefined
    // sampledPoints.clear()
    coordinateCache.clear()
    showNodeAnchors()
    graph.repaint('marquee-graph/disengage-selection-box')()
  }

  const coordinateCache = new Map<string, SchemaItem>()

  const getFromCache = (xInp: number, yInp: number) => {
    const CACHE_BUCKET_SIZE = MARQUEE_SAMPLING_RATE / 2
    const x = Math.round(xInp / CACHE_BUCKET_SIZE) * CACHE_BUCKET_SIZE
    const y = Math.round(yInp / CACHE_BUCKET_SIZE) * CACHE_BUCKET_SIZE
    const key = `${x}:${y}`
    const res = coordinateCache.get(key);
    if (res === undefined) {
      const [ topItem ] = graph.getDrawItemsByCoordinates(xInp, yInp)
      coordinateCache.set(key, topItem ?? null)
      return topItem
    }
    return res
  }

  const updateSelectedItems = (box: SelectionBox) => {
    // sampledPoints.clear()
    marqueedItemIDs.clear()

    const { x1, x2, y1, y2 } = getSelectionBoxProps(box)

    for (let x = x1 + (MARQUEE_SAMPLING_RATE / 2); x < x2; x += MARQUEE_SAMPLING_RATE) {
      for (let y = y1 + (MARQUEE_SAMPLING_RATE / 2); y < y2; y += MARQUEE_SAMPLING_RATE) {
        // sampledPoints.add({ x, y })

        const topItem = getFromCache(x, y)
        if (!topItem) continue

        const isMarqueeable = MARQUEE_SELECTABLE_GRAPH_TYPES.some(type => topItem.graphType === type)
        if (isMarqueeable) marqueedItemIDs.add(topItem.id)
      }
    }
  }

  const updateSelectionBoxDimensions = (event: MouseEvent) => {
    if (!selectionBox.value) return
    const { offsetX: x, offsetY: y } = event
    selectionBox.value.bottomRight = { x, y }
    updateSelectedItems(selectionBox.value)
    graph.repaint('marquee-graph/update-selection-box')()
  }

  graph.subscribe('onMouseDown', engageSelectionBox)
  graph.subscribe('onMouseUp', disengageSelectionBox)
  graph.subscribe('onContextMenu', disengageSelectionBox)
  graph.subscribe('onMouseMove', updateSelectionBoxDimensions)

  // const drawSampledPoints = (ctx: CanvasRenderingContext2D) => {
  //   if (!selectionBox.value) return
  //   if (graph.aggregator.value.length > 20) return
  //   const drawCirce = drawCircleWithCtx(ctx)
  //   for (const { x, y } of sampledPoints) {
  //     drawCirce({
  //       at: { x, y },
  //       radius: 1,
  //       color: MARQUEE_SELECTION_BG_COLOR,
  //     })
  //   }
  // }

  // graph.subscribe('onRepaint', drawSampledPoints)


  const getSelectionBoxSchematic = (box: SelectionBox): RectangleSchemaItem => {
    const { topLeft, bottomRight } = box
    const rect: Rectangle = {
      at: {
        x: topLeft.x,
        y: topLeft.y,
      },
      width: bottomRight.x - topLeft.x,
      height: bottomRight.y - topLeft.y,
      color: MARQUEE_SELECTION_BG_COLOR,
      stroke: {
        color: MARQUEE_SELECTION_BORDER_COLOR,
        width: 1,
      }
    }

    const boxSchemaItem: RectangleSchemaItem = {
      id: 'marquee-selection-box',
      schemaType: 'rect',
      graphType: 'marquee-selection-box',
      schema: rect,
      priority: Infinity,
    }

    return boxSchemaItem
  }

  const addSelectionBoxToAggregator = (aggregator: Aggregator) => {
    if (!selectionBox.value) return aggregator
    const selectionBoxSchemaItem = getSelectionBoxSchematic(selectionBox.value)
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
  }
}