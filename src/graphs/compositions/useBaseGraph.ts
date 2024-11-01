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
  UpdateAggregator
} from '@graph/types'
import {
  generateId,
  prioritizeNode,
  getThemeResolver,
  getConnectedEdges,
} from '@graph/helpers';
import { generateSubscriber } from '@graph/events';
import { getNodeSchematic } from '@graph/schematics/node';
import { getEdgeSchematic } from '@graph/schematics/edge';
import { themes } from '@graph/themes';
import type { BaseGraphTheme } from '@graph/themes'
import { getInitialThemeMap } from '@graph/themes/types';
import type { GraphTheme } from '@graph/themes/types';
import { delta } from '@utils/deepDelta/delta';
import { clone } from '@utils/clone';
import { getInitialEventBus } from '@graph/events';

export type BaseGraphSettings = {
  /**
   * whether to display edge labels
   * @default true
   */
  displayEdgeLabels: boolean;
  /**
   * whether edge labels should be editable
   * @default true
   */
  edgeLabelsEditable: boolean;
  /**
   * a setter for edge weights, takes the inputted string and returns a number that will be set as the edge weight
   * or undefined if the edge weight should not be set
   * @default function that attempts to parse the input as a number and if successful returns the number
   */
  edgeInputToWeight: (input: string) => number | undefined;
}

const defaultSettings = {
  displayEdgeLabels: true,
  edgeLabelsEditable: true,
  edgeInputToWeight: (input: string) => {
    const trimmed = input.trim()
    if (!trimmed) return
    return Number(trimmed)
  }
} as const

export type BaseGraphOptions = GraphOptions<BaseGraphTheme, BaseGraphSettings>

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
    ...defaultSettings,
    ...options.settings,
  })

  const eventBus = getInitialEventBus()

  const { subscribe, unsubscribe } = generateSubscriber(eventBus)

  const nodes = ref<GNode[]>([])
  const edges = ref<GEdge[]>([])

  const mouseEvents: Partial<MouseEventMap> = {
    click: (ev: MouseEvent) => {
      eventBus.onClick.forEach(fn => fn(ev))
    },
    mousedown: (ev: MouseEvent) => {
      eventBus.onMouseDown.forEach(fn => fn(ev))
    },
    mouseup: (ev: MouseEvent) => {
      eventBus.onMouseUp.forEach(fn => fn(ev))
    },
    mousemove: (ev: MouseEvent) => {
      eventBus.onMouseMove.forEach(fn => fn(ev))
    },
    dblclick: (ev: MouseEvent) => {
      eventBus.onDblClick.forEach(fn => fn(ev))
    },
    contextmenu: (ev: MouseEvent) => {
      eventBus.onContextMenu.forEach(fn => fn(ev))
    }
  }

  const keyboardEvents: Partial<KeyboardEventMap> = {
    keydown: (ev: KeyboardEvent) => {
      eventBus.onKeydown.forEach(fn => fn(ev))
    }
  }

  const aggregator = ref<Aggregator>([])
  const updateAggregator: UpdateAggregator[] = []

  updateAggregator.push((aggregator) => {

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
  })

  const repaint = (repaintId: string) => () => {
    if (!canvas.value) return
    const ctx = canvas.value.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

    const evaluateAggregator = updateAggregator.reduce<Aggregator>((acc, fn) => fn(acc), [])
    aggregator.value = [...evaluateAggregator.sort((a, b) => a.priority - b.priority)]

    const {
      drawLine,
      drawCircle,
      drawSquare,
      drawRectangle,
      drawArrow,
      drawUTurnArrow,
    } = drawShape(ctx)

    for (const item of aggregator.value) {
      if (item.schemaType === 'circle') {
        drawCircle(item.schema)
      } else if (item.schemaType === 'line') {
        drawLine(item.schema)
      } else if (item.schemaType === 'square') {
        drawSquare(item.schema)
      } else if (item.schemaType === 'rect') {
        drawRectangle(item.schema)
      } else if (item.schemaType === 'arrow') {
        drawArrow(item.schema)
      } else if (item.schemaType === 'uturn') {
        drawUTurnArrow(item.schema)
      } else {
        throw new Error('Unknown schema type')
      }
    }

    eventBus.onRepaint.forEach(fn => fn(ctx, repaintId))
  }

  // subscribe('onRepaint', (_, repaintId) => {
  //   console.log(`🎨 repaint triggered -> \n ${repaintId}`)
  // })

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

  const addNode = (node: Omit<GNode, 'id' | 'label'> & { label?: GNode['label'] }) => {
    const newNode = {
      id: generateId(),
      label: node.label ?? getNewNodeLabel(),
      x: node.x,
      y: node.y,
    }
    nodes.value.push(newNode)
    eventBus.onStructureChange.forEach(fn => fn(nodes.value, edges.value))
    eventBus.onNodeAdded.forEach(fn => fn(newNode))
    repaint('base-graph/add-node')()
    return newNode
  }

  const repaintMoveNode = repaint('base-graph/move-node')
  const moveNode = (id: GNode['id'], x: number, y: number) => {
    const node = getNode(id)
    if (!node) return
    node.x = x
    node.y = y
    repaintMoveNode()
  }

  const getDrawItemsByCoordinates = (x: number, y: number) => {
    const point = { x, y }
    const {
      isInCircle,
      isInLine,
      isInSquare,
      isInArrow,
      isInUTurnArrow,
      isInRectangle
    } = hitboxes(point)

    // TODO Make sure that this works with priority
    return aggregator.value.filter(item => {
      if (item.schemaType === 'circle') {
        return isInCircle(item.schema)
      } if (item.schemaType === 'line') {
        return isInLine(item.schema)
      } if (item.schemaType === 'square') {
        return isInSquare(item.schema)
      } if (item.schemaType === 'rect') {
        return isInRectangle(item.schema)
      } if (item.schemaType === 'arrow') {
        return isInArrow(item.schema)
      } if (item.schemaType === 'uturn') {
        return isInUTurnArrow(item.schema)
      } else {
        throw new Error('Unknown schema type')
      }
    })
  }

  /**
    @param x - the x coordinate
    @param y - the y coordinate
    @returns the node that is at the given coordinates or undefined if no node is found or is covered by another non-node item
  */
  const getNodeByCoordinates = (x: number, y: number): GNode | undefined => {
    const topItem = getDrawItemsByCoordinates(x, y).pop()
    if (!topItem) return
    if (topItem.graphType !== 'node') return
    return getNode(topItem.id)
  }

  const removeNode = (id: GNode['id']) => {
    const node = getNode(id)
    if (!node) return

    const edgesToRemove = getConnectedEdges(node, edges.value)
    for (const edge of edgesToRemove) removeEdge(edge.id)

    nodes.value = nodes.value.filter(n => n.id !== node.id)

    eventBus.onStructureChange.forEach(fn => fn(nodes.value, edges.value))
    eventBus.onNodeRemoved.forEach(fn => fn(node))

    setTimeout(repaint('base-graph/remove-node'), 5)
  }

  const addEdge = (edge: Omit<GEdge, 'id'>) => {

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
      id: generateId(),
      to: edge.to,
      from: edge.from,
      weight: edge.weight ?? 1,
      type: edge.type,
    }

    edges.value.push(newEdge)

    eventBus.onEdgeAdded.forEach(fn => fn(newEdge))
    eventBus.onStructureChange.forEach(fn => fn(nodes.value, edges.value))
    repaint('base-graph/add-edge')()
    return newEdge
  }

  const removeEdge = (edgeId: GEdge['id']) => {
    const edge = edges.value.find(edge => edge.id === edgeId)
    if (!edge) return
    edges.value = edges.value.filter(e => e.id !== edge.id)
    eventBus.onEdgeRemoved.forEach(fn => fn(edge))
    eventBus.onStructureChange.forEach(fn => fn(nodes.value, edges.value))
    repaint('base-graph/remove-edge')()
    return edge
  }

  let currHoveredNode: GNode | undefined = undefined
  subscribe('onMouseMove', (ev) => {
    const node = getNodeByCoordinates(ev.offsetX, ev.offsetY)
    if (node === currHoveredNode) return
    eventBus.onNodeHoverChange.forEach(fn => fn(node, currHoveredNode))
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
    eventBus.onGraphReset.forEach(fn => fn())
  }

  subscribe('onGraphReset', () => eventBus.onStructureChange.forEach(fn => fn(nodes.value, edges.value)))

  const activeTheme = ref(clone(theme.value))
  watch(theme, (newTheme) => {
    const themeDiff = delta(activeTheme.value, theme.value)
    if (!themeDiff) return
    activeTheme.value = clone(newTheme)
    eventBus.onThemeChange.forEach(fn => fn(themeDiff))
  }, { deep: true })

  const activeSettings = ref(clone(settings.value))
  watch(settings, (newSettings) => {
    const settingsDiff = delta(activeSettings.value, newSettings)
    if (!settingsDiff) return
    activeSettings.value = clone(settings.value)
    eventBus.onSettingsChange.forEach(fn => fn(settingsDiff))
  }, { deep: true })

  subscribe('onThemeChange', () => repaint('base-graph/on-theme-change')())
  subscribe('onSettingsChange', () => repaint('base-graph/on-settings-change')())
  subscribe('onGraphReset', () => repaint('base-graph/on-graph-reset')())

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
    getDrawItemsByCoordinates,

    eventBus,
    subscribe,
    unsubscribe,
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