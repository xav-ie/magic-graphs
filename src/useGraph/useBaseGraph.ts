import {
  ref,
  onMounted,
  onBeforeUnmount,
  readonly,
  watch,
  type Ref,
} from 'vue'
import { onClickOutside } from '@vueuse/core';
import type {
  GNode,
  GEdge,
  MouseEventMap,
  KeyboardEventMap,
  MouseEventEntries,
  KeyboardEventEntries,
  SchemaItem,
  GraphOptions,
  MappingsToEventBus,
  Aggregator,
  UpdateAggregator
} from './types'
import {
  generateSubscriber,
  generateId,
  prioritizeNode,
  getRandomPointOnCanvas
} from './helpers';
import { drawShape } from '@/shapes/draw';
import { getTextAreaLocation } from '@/shapes/draw/text';
import { hitboxes, isInTextarea } from '@/shapes/hitboxes';
import { getNodeSchematic } from './schematics/node';
import { getEdgeSchematic } from './schematics/edge';
import { themes, type BaseGraphTheme } from './themes';
import { INITIAL_THEME_MAP } from './theme/types';
import { engageTextarea } from './textarea';

export type BaseGraphEvents = {
  /* graph dataflow events */
  onStructureChange: (nodes: GNode[], edges: GEdge[]) => void;
  onFocusChange: (
    newGItemId: GNode['id'] | GEdge['id'] | undefined,
    oldGItemId: GNode['id'] | GEdge['id'] | undefined
  ) => void;
  onNodeAdded: (node: GNode) => void;
  onNodeRemoved: (node: GNode) => void;

  onEdgeAdded: (edge: GEdge) => void;
  onEdgeRemoved: (edge: GEdge) => void;

  onEdgeWeightChange: (edge: GEdge) => void;

  /*
    @description - this event is called when the graph needs to be redrawn
    WARNING: items drawn to the canvas using ctx won't be tied to the graph event architecture.
    Use updateAggregator if you need drawn item to integrate with graph apis
  */
  onRepaint: (ctx: CanvasRenderingContext2D) => void;
  onNodeHoverChange: (newNode: GNode | undefined, oldNode: GNode | undefined) => void;
  onGraphReset: () => void;

  /* canvas dom events */
  onClick: (ev: MouseEvent) => void;
  onMouseDown: (ev: MouseEvent) => void;
  onMouseUp: (ev: MouseEvent) => void;
  onMouseMove: (ev: MouseEvent) => void;
  onDblClick: (ev: MouseEvent) => void;

  /* global dom events */
  onKeydown: (ev: KeyboardEvent) => void;

  /* reactivity events */
  onThemeChange: () => void;
  onSettingsChange: () => void;
}

export type BaseGraphSettings = {
  /**
   * the number of frames per second the graph should be repainted
   * WARNING: this property can only be set at instantiation and is not reactive
   * @default 60
   */
  repaintFps: number;
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
  repaintFps: 60,
  displayEdgeLabels: true,
  edgeLabelsEditable: true,
  edgeInputToWeight: (input: string) => {
    const trimmed = input.trim()
    if (!trimmed) return
    return Number(trimmed)
  }
} as const

export type BaseGraphOptions = GraphOptions<BaseGraphTheme, BaseGraphSettings>

export const useBaseGraph =(
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<BaseGraphOptions> = {},
) => {

  const theme = ref<BaseGraphTheme>({
    ...themes.default,
    ...options.theme,
  })

  const settings = ref<BaseGraphSettings>({
    ...defaultSettings,
    ...options.settings,
  })

  const eventBus: MappingsToEventBus<BaseGraphEvents> = {
    onStructureChange: [],
    onFocusChange: [],
    onNodeAdded: [],
    onNodeRemoved: [],
    onEdgeAdded: [],
    onEdgeRemoved: [],
    onEdgeWeightChange: [],
    onRepaint: [],
    onNodeHoverChange: [],
    onGraphReset: [],
    onClick: [],
    onMouseDown: [],
    onMouseUp: [],
    onMouseMove: [],
    onDblClick: [],
    onKeydown: [],
    onThemeChange: [],
    onSettingsChange: [],
  }

  const { subscribe, unsubscribe } = generateSubscriber(eventBus)

  const nodes = ref<GNode[]>([])
  const edges = ref<GEdge[]>([])
  const focusedId = ref<GNode['id'] | GEdge['id'] | undefined>()

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
  }

  const keyboardEvents: Partial<KeyboardEventMap> = {
    keydown: (ev: KeyboardEvent) => {
      eventBus.onKeydown.forEach(fn => fn(ev))
    }
  }

  // function breaks with guard clauses!!!
  const handleFocusChange = (ev: MouseEvent) => {
    const focusableTypes: SchemaItem['graphType'][] = ['node', 'edge']
    const topItem = getDrawItemsByCoordinates(ev.offsetX, ev.offsetY).pop()
    if (!topItem || !focusableTypes.includes(topItem.graphType)) return setFocus(undefined)

    const textInputHandler = (str: string) => {
      const edge = getEdge(topItem.id)
      if (!edge) throw new Error('Textarea only implemented for edges')
      const newWeight = settings.value.edgeInputToWeight(str)
      if (!newWeight) return
      if (edge.weight === newWeight) return
      edge.weight = newWeight
      eventBus.onEdgeWeightChange.forEach(fn => fn(edge))
    }

    const { schema, schemaType } = topItem

    if ('textArea' in schema && schema.textArea?.editable ) {

      if (schemaType === 'arrow' || schemaType === 'line') {

        const textAreaLocationArrow = getTextAreaLocation.arrow(schema)
        const textAreaLocationLine = getTextAreaLocation.line(schema)
        const textAreaLocation = schemaType === 'arrow' ? textAreaLocationArrow : textAreaLocationLine

        const isInTextAreaFns = isInTextarea({ x: ev.offsetX, y: ev.offsetY })
        const textAreaSelected = schemaType === 'arrow' ? isInTextAreaFns.arrow(schema) : isInTextAreaFns.line(schema)
        if (schema.textArea && textAreaSelected) {
          engageTextarea({ ...schema.textArea, at: textAreaLocation }, textInputHandler)
          return setFocus(undefined)
        }
      } else if (schemaType === 'uturn') {
        const textAreaLocationUTurn = getTextAreaLocation.uTurn(schema)
        const isInTextAreaFns = isInTextarea({ x: ev.offsetX, y: ev.offsetY })
        const textAreaSelected = isInTextAreaFns.uTurn(schema)
        if (schema.textArea && textAreaSelected) {
          engageTextarea({ ...schema.textArea, at: textAreaLocationUTurn }, textInputHandler)
          return setFocus(undefined)
        }
      }
    }
    setFocus(topItem.id)
  }

  subscribe('onMouseDown', handleFocusChange)

  const aggregator = ref<Aggregator>([])
  const updateAggregator: UpdateAggregator[] = []

  updateAggregator.push((aggregator) => {

    const edgeSchemaItems = edges.value.map((edge, i) => {
      const schema = getEdgeSchematic(edge, nodes.value, edges.value, theme.value, settings.value, focusedId.value)
      if (!schema) return
      return {
        ...schema,
        priority: i * 10
      }
    }).filter((item) => item && item.schema) as SchemaItem[]

    const nodeSchemaItems = nodes.value.map((node, i) => {
      const schema = getNodeSchematic(node, theme.value, focusedId.value)
      if (!schema) return
      return {
        ...schema,
        priority: (i * 10) + 1000,
      }
    }).filter((item) => item && item.schema) as SchemaItem[]

    aggregator.push(...edgeSchemaItems)
    aggregator.push(...nodeSchemaItems)
    return aggregator
  })

  const drawGraphInterval = setInterval(() => {
    if (!canvas.value) return
    const ctx = canvas.value.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

    const evaluateAggregator = updateAggregator.reduce<SchemaItem[]>((acc, fn) => fn(acc), [])
    aggregator.value = [...evaluateAggregator.sort((a, b) => a.priority - b.priority)]
    const { drawLine, drawCircle, drawSquare, drawArrow, drawUTurnArrow } = drawShape(ctx)
    for (const item of aggregator.value) {
      if (item.schemaType === 'circle') {
        drawCircle(item.schema)
      } else if (item.schemaType === 'line') {
        drawLine(item.schema)
      } else if (item.schemaType === 'square') {
        drawSquare(item.schema)
      } else if (item.schemaType === 'arrow') {
        drawArrow(item.schema)
      } else if (item.schemaType === 'uturn') {
        drawUTurnArrow(item.schema)
      } else {
        throw new Error('Unknown schema type')
      }

      eventBus.onRepaint.forEach(fn => fn(ctx))
    }
  }, 1000 / settings.value.repaintFps)

  const stopClickOutsideListener = onClickOutside(canvas, () => setFocus(undefined))

  const changeCanvasColor = () => {
    if (!canvas.value) return
    canvas.value.style.backgroundColor = theme.value.graphBgColor
  }

  onMounted(() => {
    if (!canvas.value) {
      throw new Error('Canvas element not found')
    }

    canvas.value.style.backgroundColor = theme.value.graphBgColor
    subscribe('onThemeChange', changeCanvasColor)

    for (const [event, listeners] of Object.entries(mouseEvents) as MouseEventEntries) {
      canvas.value.addEventListener(event, listeners)
    }

    for (const [event, listeners] of Object.entries(keyboardEvents) as KeyboardEventEntries) {
      document.addEventListener(event, listeners)
    }
  })

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

    clearInterval(drawGraphInterval)
    stopClickOutsideListener()
  })

  const getNewNodeLabel = () => {
    const labels = nodes.value.map(node => node.label)
    let label = 1
    while (labels.includes(label.toString())) label++
    return label.toString()
  }

  const addNode = (node: Partial<GNode>, focusNode = true) => {
    const { x, y } = canvas.value ? getRandomPointOnCanvas(canvas.value) : { x: 0, y: 0 }
    const newNode = {
      id: node.id ?? generateId(),
      label: node.label ?? getNewNodeLabel(),
      x: node.x ?? x,
      y: node.y ?? y,
    }
    nodes.value.push(newNode)
    eventBus.onStructureChange.forEach(fn => fn(nodes.value, edges.value))
    eventBus.onNodeAdded.forEach(fn => fn(newNode))
    if (focusNode) setFocus(newNode.id)
    return newNode
  }

  const moveNode = (id: GNode['id'], x: number, y: number) => {
    const node = nodes.value.find(node => node.id === id)
    if (node) {
      node.x = x
      node.y = y
    }
  }

  const getNode = (id: GNode['id']) => {
    return nodes.value.find(node => node.id === id)
  }

  const getEdge = (id: GEdge['id']) => {
    return edges.value.find(edge => edge.id === id)
  }

  const getDrawItemsByCoordinates = (x: number, y: number) => {
    const point = { x, y }
    const { isInCircle, isInLine, isInSquare, isInArrow, isInUTurnArrow } = hitboxes(point)

    // TODO Make sure that this works with priority
    return aggregator.value.filter(item => {
      if (item.schemaType === 'circle') {
        return isInCircle(item.schema)
      } if (item.schemaType === 'line') {
        return isInLine(item.schema)
      } if (item.schemaType === 'square') {
        return isInSquare(item.schema)
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
    return nodes.value.find(node => node.id === topItem.id)
  }

  const removeNode = (id: GNode['id']) => {
    const index = nodes.value.findIndex(node => node.id === id)
    if (index === -1) return
    const removedNode = nodes.value[index]
    nodes.value.splice(index, 1)
    edges.value = edges.value.filter(edge => edge.from !== removedNode.label && edge.to !== removedNode.label)
    eventBus.onStructureChange.forEach(fn => fn(nodes.value, edges.value))
    eventBus.onNodeRemoved.forEach(fn => fn(removedNode))
  }

  const addEdge = (edge: Omit<GEdge, 'id'>) => {

    const directedEdgeCond = (e: GEdge) => e.from === edge.from && e.to === edge.to
    const undirectedEdgeCond = (e: GEdge) => (e.from === edge.from && e.to === edge.to) || (e.from === edge.to && e.to === edge.from)
    const edgeExists = edge.type === 'directed' ? edges.value.some(directedEdgeCond) : edges.value.some(undirectedEdgeCond)

    if (edgeExists) return
    if (edge.type === 'undirected' && edge.from === edge.to) return

    const newEdge: GEdge = {
      to: edge.to,
      from: edge.from,
      weight: edge.weight ?? 1,
      type: edge.type,
      id: generateId()
    }

    edges.value.push(newEdge)

    eventBus.onEdgeAdded.forEach(fn => fn(newEdge))
    eventBus.onStructureChange.forEach(fn => fn(nodes.value, edges.value))

    return newEdge
  }

  const removeEdge = (edgeId: GEdge['id']) => {
    const edge = edges.value.find(edge => edge.id === edgeId)
    if (!edge) return
    edges.value = edges.value.filter(e => e.id !== edge.id)

    eventBus.onEdgeRemoved.forEach(fn => fn(edge))
    eventBus.onStructureChange.forEach(fn => fn(nodes.value, edges.value))
    return edge
  }

  const setFocus = (newGItemId: GNode['id'] | GEdge['id'] | undefined) => {
    if (focusedId.value === newGItemId) return
    eventBus.onFocusChange.forEach(fn => fn(newGItemId, focusedId.value))
    focusedId.value = newGItemId
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


  const reset = () => {
    nodes.value = []
    edges.value = []
    focusedId.value = undefined
    eventBus.onGraphReset.forEach(fn => fn())
  }

  subscribe('onGraphReset', () => eventBus.onStructureChange.forEach(fn => fn(nodes.value, edges.value)))

  updateAggregator.push(liftHoveredNodeToTop)

  watch(theme, () => eventBus.onThemeChange.forEach(fn => fn()), { deep: true })

  watch(settings, () => {
    eventBus.onSettingsChange.forEach(fn => fn())
  }, { deep: true })

  return {
    nodes,
    edges,
    addNode,
    moveNode,
    getNode,
    getEdge,
    getNodeByCoordinates,
    getDrawItemsByCoordinates,
    removeNode,
    addEdge,
    removeEdge,
    getFocusedItem: () => {
      if (!focusedId.value) return
      const node = getNode(focusedId.value)
      if (node) return { item: node, type: 'node' } as const
      const edge = getEdge(focusedId.value)
      if (edge) return { item: edge, type: 'edge' } as const
    },
    focusedId: readonly(focusedId),
    setFocus,

    eventBus,
    subscribe,
    unsubscribe,
    updateAggregator,
    aggregator,

    theme,
    themeMap: INITIAL_THEME_MAP,
    settings,

    reset,

    canvas,
  }
}