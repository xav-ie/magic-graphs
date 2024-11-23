import {
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
} from 'vue'
import type { Ref } from 'vue'
import type {
  GNode,
  GEdge,
  MouseEventMap,
  KeyboardEventMap,
  MouseEventEntries,
  KeyboardEventEntries,
  SchemaItem,
  GraphOptions,
  Aggregator,
} from '@graph/types'
import { prioritizeNode } from '@graph/helpers';
import { getNodeSchematic } from '@graph/schematics/node';
import { getEdgeSchematic } from '@graph/schematics/edge';
import { THEMES } from '@graph/themes';
import type { GraphTheme } from '@graph/themes'
import { getInitialThemeMap } from '@graph/themes/types';
import { delta } from '@utils/deepDelta';
import { clone } from '@utils/clone';
import { getInitialEventBus, generateSubscriber } from '@graph/events';
import type { PartiallyPartial } from '@utils/types';
import { DEFAULT_GRAPH_SETTINGS } from '@graph/settings';
import type { GraphSettings } from '@graph/settings';
import { getThemeResolver } from '@graph/themes/getThemeResolver';
import { useNodeEdgeMap } from './useNodeEdgeMap';
import { useAggregator } from './useAggregator';
import { useGraphCRUD } from './useGraphCRUD';
import { getCtx } from '@utils/ctx';

export const useBaseGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<GraphOptions> = {},
) => {

  const theme = ref<GraphTheme>({
    ...THEMES.light,
    ...options.theme,
  })

  const themeMap = getInitialThemeMap()
  const getTheme = getThemeResolver(theme, themeMap)

  const settings = ref<GraphSettings>({
    ...DEFAULT_GRAPH_SETTINGS,
    ...options.settings,
  })

  const eventBus = getInitialEventBus()

  const { subscribe, unsubscribe, emit } = generateSubscriber(eventBus)


  const nodes = ref<GNode[]>([])
  const edges = ref<GEdge[]>([])

  const mouseOptions = (ev: MouseEvent) => {
    const ctx = getCtx(canvas)
    const transform = ctx.getTransform();
    const invertedTransform = transform.inverse();
    const x = invertedTransform.a * ev.offsetX + invertedTransform.c * ev.offsetY + invertedTransform.e;
    const y = invertedTransform.b * ev.offsetX + invertedTransform.d * ev.offsetY + invertedTransform.f;
    const coords = { x, y }
    const items = getSchemaItemsByCoordinates(coords.x, coords.y)
    return { ev, coords, items }
  }

  const mouseEvents: Partial<MouseEventMap> = {
    click: (ev: MouseEvent) => emit('onClick', mouseOptions(ev)),
    mousedown: (ev: MouseEvent) => emit('onMouseDown', mouseOptions(ev)),
    mouseup: (ev: MouseEvent) => emit('onMouseUp', mouseOptions(ev)),
    mousemove: (ev: MouseEvent) => emit('onMouseMove', mouseOptions(ev)),
    dblclick: (ev: MouseEvent) => emit('onDblClick', mouseOptions(ev)),
    contextmenu: (ev: MouseEvent) => emit('onContextMenu', mouseOptions(ev)),
  }

  const keyboardEvents: Partial<KeyboardEventMap> = {
    keydown: (ev: KeyboardEvent) => emit('onKeyDown', ev),
    keyup: (ev: KeyboardEvent) => emit('onKeyUp', ev),
  }

  const {
    aggregator,
    updateAggregator,
    getSchemaItemsByCoordinates,
  } = useAggregator({ canvas, emit })

  const addNodesAndEdgesToAggregator = (aggregator: Aggregator) => {
    const edgeOptions = {
      edges,
      getNode,
      getEdge,
      getTheme,
      settings,
    }

    const edgeSchemaItems = edges.value
      .map((edge) => getEdgeSchematic(edge, edgeOptions))
      .filter(Boolean)
      .map((item, i) => ({ ...item, priority: i * 10 })) as SchemaItem[]

    const nodeSchemaItems = nodes.value
      .map((node) => getNodeSchematic(node, getTheme))
      .filter(Boolean)
      .map((item, i) => ({ ...item, priority: (i * 10) + 1000 })) as SchemaItem[]

    aggregator.push(...edgeSchemaItems)
    aggregator.push(...nodeSchemaItems)

    return aggregator
  }

  updateAggregator.push(addNodesAndEdgesToAggregator)

  const initCanvas = () => {
    if (!canvas.value) {
      throw new Error('canvas element not found')
    }

    for (const [event, listeners] of Object.entries(mouseEvents) as MouseEventEntries) {
      canvas.value.addEventListener(event, listeners)
    }

    for (const [event, listeners] of Object.entries(keyboardEvents) as KeyboardEventEntries) {
      document.addEventListener(event, listeners)
    }
  }

  onMounted(initCanvas)

  onBeforeUnmount(() => {
    if (!canvas.value) {
      throw new Error('Canvas element not found')
    }

    for (const [event, listeners] of Object.entries(mouseEvents) as MouseEventEntries) {
      canvas.value.removeEventListener(event, listeners)
    }

    for (const [event, listeners] of Object.entries(keyboardEvents) as KeyboardEventEntries) {
      document.removeEventListener(event, listeners)
    }
  })

  const { nodeIdToNodeMap, edgeIdToEdgeMap } = useNodeEdgeMap(nodes, edges)
  const {
    getNode,
    getEdge,
    addNode,
    addEdge,
    moveNode,
    removeNode,
    removeEdge,
    bulkAddNode,
    bulkRemoveNode,
    bulkAddEdge,
    bulkRemoveEdge,
  } = useGraphCRUD({
    nodes,
    edges,
    nodeMap: nodeIdToNodeMap,
    edgeMap: edgeIdToEdgeMap,
    emit,
    settings,
  })

  const getNodeByCoordinates = (x: number, y: number) => {
    const topItem = getSchemaItemsByCoordinates(x, y).pop()
    if (!topItem) return
    if (topItem.graphType !== 'node') return
    return getNode(topItem.id)
  }

  let currHoveredNode: GNode | undefined = undefined
  subscribe('onMouseMove', (coords) => {
    const node = getNodeByCoordinates(coords.x, coords.y)
    if (node === currHoveredNode) return
    emit('onNodeHoverChange', node, currHoveredNode)
    currHoveredNode = node
  })

  const liftHoveredNodeToTop = (aggregator: Aggregator) => {
    if (!currHoveredNode) return aggregator
    prioritizeNode(currHoveredNode.id, aggregator)
    return aggregator
  }

  updateAggregator.push(liftHoveredNodeToTop)

  const reset = () => {
    nodes.value = []
    edges.value = []
    emit('onGraphReset')
  }

  subscribe('onGraphReset', () => emit('onStructureChange', nodes.value, edges.value))

  const activeTheme = ref(clone(theme.value))
  watch(theme, (newTheme) => {
    const themeDiff = delta(activeTheme.value, theme.value)
    if (!themeDiff) return
    activeTheme.value = clone(newTheme)
    emit('onThemeChange', themeDiff)
  }, { deep: true })

  const activeSettings = ref(clone(settings.value))
  watch(settings, (newSettings) => {
    const settingsDiff = delta(activeSettings.value, newSettings)
    if (!settingsDiff) return
    activeSettings.value = clone(settings.value)
    emit('onSettingsChange', settingsDiff)
  }, { deep: true })

  return {
    /**
     * all the nodes contained in the graph
     */
    nodes,
    /**
     * all the edges contained in the graph
     */
    edges,

    getNode,
    getEdge,

    addNode,
    addEdge,

    moveNode,

    removeNode,
    removeEdge,

    bulkAddNode,
    bulkRemoveNode,

    bulkAddEdge,
    bulkRemoveEdge,

    /**
     * get a node by its coordinates
     *
     * @param x - the x coord
     * @param y - the y coord
     * @returns the node at given coords or undefined if not there or obscured by another schema item
     */
    getNodeByCoordinates,

    getSchemaItemsByCoordinates,

    /**
     * a mapping of all graph events to a set of their callback functions
     */
    eventBus,
    subscribe,
    unsubscribe,
    emit,

    updateAggregator,
    aggregator,

    theme,
    getTheme,
    themeMap,
    settings,

    reset,

    canvas,
  }
}

export type BaseGraph = ReturnType<typeof useBaseGraph>