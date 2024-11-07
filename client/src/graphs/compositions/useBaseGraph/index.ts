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
  getConnectedEdges,
} from '@graph/helpers';
import { getNodeSchematic } from '@graph/schematics/node';
import { getEdgeSchematic } from '@graph/schematics/edge';
import { THEMES } from '@graph/themes';
import type { GraphTheme } from '@graph/themes'
import { getInitialThemeMap } from '@graph/themes/types';
import { delta } from '@utils/deepDelta/delta';
import { clone } from '@utils/clone';
import { getInitialEventBus, generateSubscriber } from '@graph/events';
import { useAggregator } from '@graph/useAggregator';
import {
  ADD_NODE_OPTIONS_DEFAULTS,
  REMOVE_NODE_OPTIONS_DEFAULTS,
  ADD_EDGE_OPTIONS_DEFAULTS,
  ADD_EDGE_DEFAULTS,
  REMOVE_EDGE_OPTIONS_DEFAULTS,
  MOVE_NODE_OPTIONS_DEFAULTS,
} from '@graph/compositions/useBaseGraph/types';
import type {
  AddNodeOptions,
  RemoveNodeOptions,
  AddEdgeOptions,
  RemoveEdgeOptions,
  MoveNodeOptions,
} from '@graph/compositions/useBaseGraph/types';
import type { PartiallyPartial } from '@utils/types';
import { DEFAULT_GRAPH_SETTINGS } from '@graph/settings';
import type { GraphSettings } from '@graph/settings';
import { getThemeResolver } from '@graph/themes/getThemeResolver';

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
    coords: { x: number, y: number },
    options: Partial<MoveNodeOptions> = {}
  ) => {
    const node = getNode(id)
    if (!node) return

    const fullOptions = {
      ...MOVE_NODE_OPTIONS_DEFAULTS,
      ...options
    }

    node.x = coords.x
    node.y = coords.y
    emit('onNodeMoved', node, fullOptions)
    repaintMoveNode()
  }

  const getNodeByCoordinates = (x: number, y: number) => {
    const topItem = getSchemaItemsByCoordinates(x, y).pop()
    if (!topItem) return
    if (topItem.graphType !== 'node') return
    return getNode(topItem.id)
  }

  const removeNode = (id: GNode['id'], options: Partial<RemoveNodeOptions> = {}) => {
    const node = getNode(id)
    if (!node) return

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
    edge: PartiallyPartial<GEdge, keyof typeof ADD_EDGE_DEFAULTS | 'id'>,
    options: Partial<AddEdgeOptions> = {}
  ) => {
    const fullOptions = {
      ...ADD_EDGE_OPTIONS_DEFAULTS,
      ...options
    }

    const [fromNode, toNode] = [getNode(edge.from), getNode(edge.to)]
    if (!fromNode || !toNode) return

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

    // if the edge type is undirected, check the other directed way
    if (edge.type === 'undirected') {
      const directedEdgeOnPath = edges.value.find(e => {
        return e.to === edge.from && e.from === edge.to
      })

      if (directedEdgeOnPath) return
    }

    const newEdge: GEdge = {
      ...ADD_EDGE_DEFAULTS,
      id: generateId(),
      ...edge,
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
    if (!edge) return

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
    /**
     * all the nodes contained in the graph
     */
    nodes,
    /**
     * all the edges contained in the graph
     */
    edges,

    /**
     * get a node by its id
     *
     * @param id
     * @returns the node or undefined if not found
     */
    getNode,
    /**
     * get an edge by its id
     *
     * @param id
     * @returns the edge or undefined if not found
     */
    getEdge,

    /**
     * add a node to the graph
     *
     * @param node - the node to add
     * @param options - override default effects (onNodeAdded event)
     * @returns the added node or undefined if not added
     */
    addNode,
    /**
     * move a node to a new position (in place mutation)
     *
     * @param id - the id of the node to move
     * @param coords - the new coordinates (x, y)
     * @param options - override default effects (onNodeMoved event)
     * @returns void
     */
    moveNode,
    /**
     * remove a node from the graph
     *
     * @param id - the id of the node to remove
     * @param options - override default effects (onNodeRemoved event)
     * @returns the removed node or undefined if not removed
     */
    removeNode,

    /**
     * add an edge to the graph
     *
     * @param edge - the edge to add
     * @param options - override default effects (onEdgeAdded event)
     * @returns the added edge or undefined if not added
     */
    addEdge,
    /**
     * remove an edge from the graph
     *
     * @param edgeId - the id of the edge to remove
     * @param options - override default effects (onEdgeRemoved event)
     * @returns the removed edge or undefined if not removed
     */
    removeEdge,

    /**
     * get a node by its coordinates
     *
     * @param x - the x coord
     * @param y - the y coord
     * @returns the node at given coords or undefined if not there or obscured by another schema item
     */
    getNodeByCoordinates,
    /**
     * get all schema items at given coordinates
     *
     * @param x - the x coord
     * @param y - the y coord
     * @returns an array where the first item is the bottom most schema item and the last is the top most
     * @example // returns [node, nodeAnchor] where a nodeAnchor is sitting on top of a node
     * getSchemaItemsByCoordinates(200, 550)
     */
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

    repaint,
    canvas,
  }
}

export type BaseGraph = ReturnType<typeof useBaseGraph>