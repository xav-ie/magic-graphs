import {
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  computed,
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
import {
  generateId,
  prioritizeNode,
  getThemeResolver,
  getConnectedEdges,
} from '@graph/helpers';
import { getNodeSchematic } from '@graph/schematics/node';
import { getEdgeSchematic } from '@graph/schematics/edge';
import { themes } from '@graph/themes';
import type { BaseGraphTheme } from '@graph/themes'
import { getInitialThemeMap } from '@graph/themes/types';
import type { GraphTheme } from '@graph/themes';
import { delta } from '@utils/deepDelta/delta';
import { clone } from '@utils/clone';
import { getInitialEventBus, generateSubscriber } from '@graph/events';
import { useAggregator } from '@graph/useAggregator';
import {
  ADD_NODE_OPTIONS_DEFAULTS,
  REMOVE_NODE_OPTIONS_DEFAULTS,
  ADD_EDGE_OPTIONS_DEFAULTS,
  REMOVE_EDGE_OPTIONS_DEFAULTS,
  MOVE_NODE_OPTIONS_DEFAULTS,
} from '@graph/baseGraphAPIs';
import type {
  AddNodeOptions,
  RemoveNodeOptions,
  AddEdgeOptions,
  RemoveEdgeOptions,
  MoveNodeOptions,
} from '@graph/baseGraphAPIs';
import type { PartiallyPartial } from '@utils/types';
import { DEFAULT_BASE_SETTINGS } from '@graph/settings';
import type { BaseGraphSettings } from '@graph/settings';

export type BaseGraphOptions = GraphOptions<BaseGraphSettings>

export const useBaseGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<BaseGraphOptions> = {},
) => {

  const theme = ref<BaseGraphTheme>({
    ...themes.default,
    ...options.theme,
  })

  const themeMap = getInitialThemeMap()
  const getTheme = getThemeResolver(theme, themeMap)

  const settings = ref<BaseGraphSettings>({
    ...DEFAULT_BASE_SETTINGS,
    ...options.settings,
  })

  const eventBus = getInitialEventBus()

  const { subscribe, unsubscribe, emit } = generateSubscriber(eventBus)

  const nodes = ref<GNode[]>([])
  const edges = ref<GEdge[]>([])

  const mouseEvents: Partial<MouseEventMap> = {
    click: (ev: MouseEvent) => emit('onClick', ev),
    mousedown: (ev: MouseEvent) => emit('onMouseDown', ev),
    mouseup: (ev: MouseEvent) => emit('onMouseUp', ev),
    mousemove: (ev: MouseEvent) => emit('onMouseMove', ev),
    dblclick: (ev: MouseEvent) => emit('onDblClick', ev),
    contextmenu: (ev: MouseEvent) => emit('onContextMenu', ev),
  }

  const keyboardEvents: Partial<KeyboardEventMap> = {
    keydown: (ev: KeyboardEvent) => emit('onKeydown', ev),
  }

  const {
    aggregator,
    updateAggregator,
    getSchemaItemsByCoordinates,
    repaint,
  } = useAggregator({ canvas, emit })

  const addNodesAndEdgesToAggregator = (aggregator: Aggregator) => {
    const edgeOptions = {
      edges,
      getNode,
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

  const getNewNodeLabel = () => {
    const labels = nodes.value.map(node => node.label)
    let label = 1
    while (labels.includes(label.toString())) label++
    return label.toString()
  }

  const nodeIdToNodeMap = computed(() => {
    const map = new Map<GNode['id'], GNode>()
    for (const node of nodes.value) map.set(node.id, node)
    return map
  })

  const edgeIdToEdgeMap = computed(() => {
    const map = new Map<GEdge['id'], GEdge>()
    for (const edge of edges.value) map.set(edge.id, edge)
    return map
  })

  const getNode = (id: GNode['id']) => nodeIdToNodeMap.value.get(id)
  const getEdge = (id: GEdge['id']) => edgeIdToEdgeMap.value.get(id)

  const addNode = (
    node: PartiallyPartial<GNode, 'id' | 'label'>,
    options: Partial<AddNodeOptions> = {}
  ) => {
    const fullOptions = {
      ...ADD_NODE_OPTIONS_DEFAULTS,
      ...options
    }

    const newNode = {
      id: node.id ?? generateId(),
      label: node.label ?? getNewNodeLabel(),
      x: node.x,
      y: node.y,
    }
    nodes.value.push(newNode)
    emit('onStructureChange', nodes.value, edges.value)
    emit('onNodeAdded', newNode, fullOptions)
    repaint('base-graph/add-node')()
    return newNode
  }

  const repaintMoveNode = repaint('base-graph/move-node')
  const moveNode = (
    id: GNode['id'],
    x: number,
    y: number,
    options: Partial<MoveNodeOptions> = {}
  ) => {
    const node = getNode(id)
    if (!node) throw new Error('tried to move node that does not exist')

    const fullOptions = {
      ...MOVE_NODE_OPTIONS_DEFAULTS,
      ...options
    }

    node.x = x
    node.y = y
    emit('onNodeMoved', node, fullOptions)
    repaintMoveNode()
  }

  /**
    @param x - the x coord
    @param y - the y coord
    @returns the node at given coords or undefined if not there or obscured by another schema item
  */
  const getNodeByCoordinates = (x: number, y: number) => {
    const topItem = getSchemaItemsByCoordinates(x, y).pop()
    if (!topItem) return
    if (topItem.graphType !== 'node') return
    return getNode(topItem.id)
  }

  const removeNode = (id: GNode['id'], options: Partial<RemoveNodeOptions> = {}) => {
    const node = getNode(id)
    if (!node) throw new Error('tried to remove node that does not exist')

    const fullOptions = {
      ...REMOVE_NODE_OPTIONS_DEFAULTS,
      ...options
    }

    const edgesToRemove = getConnectedEdges(node, edges.value)
    for (const edge of edgesToRemove) removeEdge(edge.id)

    nodes.value = nodes.value.filter(n => n.id !== node.id)

    emit('onStructureChange', nodes.value, edges.value)
    emit('onNodeRemoved', node, fullOptions)

    setTimeout(repaint('base-graph/remove-node'), 5)
  }

  const addEdge = (
    edge: PartiallyPartial<GEdge, 'id' | 'weight' | 'label'>,
    options: Partial<AddEdgeOptions> = {}
  ) => {
    const fullOptions = {
      ...ADD_EDGE_OPTIONS_DEFAULTS,
      ...options
    }

    const undirectedEdgeOnPath = edges.value.find(e => {
      const connectedToFrom = e.to === edge.to && e.from === edge.from
      const connectedFromTo = e.to === edge.from && e.from === edge.to
      return (connectedToFrom || connectedFromTo) && e.type === 'undirected'
    })

    if (undirectedEdgeOnPath) return

    const directedEdgeOnPath = edges.value.find(e => {
      return e.to === edge.to && e.from === edge.from
    })

    if (directedEdgeOnPath) return

    const newEdge: GEdge = {
      id: edge.id ?? generateId(),
      to: edge.to,
      from: edge.from,
      label: edge.label ?? '',
      weight: edge.weight ?? 1,
      type: edge.type,
    }

    edges.value.push(newEdge)

    emit('onEdgeAdded', newEdge, fullOptions)
    emit('onStructureChange', nodes.value, edges.value)
    repaint('base-graph/add-edge')()
    return newEdge
  }

  const removeEdge = (
    edgeId: GEdge['id'],
    options: Partial<RemoveEdgeOptions> = {}
  ) => {
    const edge = getEdge(edgeId)
    if (!edge) throw new Error('tried to remove edge that does not exist')

    const fullOptions = {
      ...REMOVE_EDGE_OPTIONS_DEFAULTS,
      ...options
    }

    edges.value = edges.value.filter(e => e.id !== edge.id)

    emit('onEdgeRemoved', edge, fullOptions)
    emit('onStructureChange', nodes.value, edges.value)
    repaint('base-graph/remove-edge')()
    return edge
  }

  let currHoveredNode: GNode | undefined = undefined
  subscribe('onMouseMove', (ev) => {
    const { offsetX: x, offsetY: y } = ev
    const node = getNodeByCoordinates(x, y)
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

  subscribe('onThemeChange', () => repaint('base-graph/on-theme-change')())
  subscribe('onSettingsChange', () => repaint('base-graph/on-settings-change')())
  subscribe('onGraphReset', () => repaint('base-graph/on-graph-reset')())
  subscribe('onEdgeWeightChange', () => repaint('base-graph/on-edge-weight-change')())

  return {
    nodes,
    getNode,

    edges,
    getEdge,

    addNode,
    moveNode,
    removeNode,

    addEdge,
    removeEdge,

    getNodeByCoordinates,
    getSchemaItemsByCoordinates,

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

    repaint,
    canvas,
  }
}

export type BaseGraph = ReturnType<typeof useBaseGraph>