import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { onClickOutside } from '@vueuse/core'
import { themes } from './themes'

type GetterOrValue<T, K extends any[] = []> = T | ((...arg: K) => T)
type NodeGetterOrValue<T> = GetterOrValue<T, [Node]>
type EdgeGetterOrValue<T> = GetterOrValue<T, [Edge]>

type EventNames = keyof HTMLElementEventMap

type FilterEventNames<T> = {
  [K in EventNames]: HTMLElementEventMap[K] extends T ? K : never
}[EventNames]

type MouseEventNames = FilterEventNames<MouseEvent>
type KeyboardEventNames = FilterEventNames<KeyboardEvent>

type EventMap<T extends EventNames, E> = Record<T, (ev: E) => void>

type MouseEventMap = EventMap<MouseEventNames, MouseEvent>
type KeyboardEventMap = EventMap<KeyboardEventNames, KeyboardEvent>

type MouseEventEntries = [keyof MouseEventMap, (ev: MouseEvent) => void][]
type KeyboardEventEntries = [keyof KeyboardEventMap, (ev: KeyboardEvent) => void][]

type UseGraphEventBusCallbackMappings = {
  /* graph dataflow events */
  onStructureChange: ((nodes: Node[], edges: Edge[]) => void);
  onNodeFocusChange: ((newNode: Node | undefined, oldNode: Node | undefined) => void);

  /* canvas dom events */
  onClick: ((ev: MouseEvent) => void);
  onMouseDown: ((ev: MouseEvent) => void);
  onMouseUp: ((ev: MouseEvent) => void);
  onMouseMove: ((ev: MouseEvent) => void);
  onDblClick: ((ev: MouseEvent) => void);

  /* global dom events */
  onKeydown: ((ev: KeyboardEvent) => void);
}

type UseGraphEventBus = Record<keyof UseGraphEventBusCallbackMappings, any[]>

const getValue = <T, K extends any[]>(value: GetterOrValue<T, K>, ...args: K) => {
  if (typeof value === 'function') {
    return (value as (...args: K) => T)(...args)
  }
  return value
}

export type GraphOptions = Partial<{
  nodeSize: NodeGetterOrValue<number>,
  nodeBorderSize: NodeGetterOrValue<number>,
  nodeColor: NodeGetterOrValue<string>,
  nodeBorderColor: NodeGetterOrValue<string>,
  nodeFocusBorderColor: NodeGetterOrValue<string>,
  nodeFocusColor: NodeGetterOrValue<string>,
  nodeText: NodeGetterOrValue<string>,
  nodeTextSize: NodeGetterOrValue<number>,
  nodeTextColor: NodeGetterOrValue<string>,
  edgeColor: EdgeGetterOrValue<string>,
  edgeWidth: EdgeGetterOrValue<number>,

  /* for loading existing graphs */
  nodes: Node[],
  edges: Edge[],

  /* callbacks */

  /* is invoked whenever a node or edge is added or removed */
  onStructureChange: (nodes: Node[], edges: Edge[]) => void,
}>

export type Node = {
  id: number,
  x: number,
  y: number,
}

export type Edge = {
  to: number,
  from: number,
}

export const useGraph = (canvas: Ref<HTMLCanvasElement>, options: GraphOptions = {}) => {

  const {
    nodeSize = 35,
    nodeBorderSize = 8,
    nodeColor = 'white',
    nodeBorderColor = 'black',
    nodeFocusBorderColor = 'blue',
    nodeFocusColor = 'white',
    nodeText = (node: Node) => node.id.toString(),
    nodeTextSize = 24,
    nodeTextColor = 'black',
    edgeColor = 'black',
    edgeWidth = 10,
    nodes: defaultNodes = [],
    edges: defaultEdges = [],
  } = options

  let nodeIdCount = 1
  const nodes = ref<Node[]>([])
  const edges = ref<Edge[]>([])
  const focusedNodeId = ref<Node['id'] | undefined>()

  const eventBus: UseGraphEventBus = {
    onStructureChange: [],
    onNodeFocusChange: [],

    /* canvas element events */
    onClick: [],
    onMouseDown: [],
    onMouseUp: [],
    onMouseMove: [],
    onDblClick: [],

    onKeydown: [],
  }

  if (options.onStructureChange) {
    eventBus.onStructureChange.push(options.onStructureChange)
  }

  const drawNode = (ctx: CanvasRenderingContext2D, node: Node) => {
    // draw node
    ctx.beginPath()
    ctx.arc(node.x, node.y, getValue(nodeSize, node), 0, Math.PI * 2)
    const fillColor = node.id === focusedNodeId.value ? nodeFocusColor : nodeColor
    ctx.fillStyle = getValue(fillColor, node)
    ctx.fill()

    // draw border
    const borderColor = node.id === focusedNodeId.value ? nodeFocusBorderColor : nodeBorderColor
    ctx.strokeStyle = getValue(borderColor, node)
    ctx.lineWidth = getValue(nodeBorderSize, node)
    ctx.stroke()
    ctx.closePath()

    // draw text label
    ctx.font = `bold ${getValue(nodeTextSize, node)}px Arial`
    ctx.fillStyle = getValue(nodeTextColor, node)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(getValue(nodeText, node), node.x, node.y)
  }

  const drawEdge = (ctx: CanvasRenderingContext2D, edge: Edge) => {
    const from = nodes.value.find(node => node.id === edge.from)
    const to = nodes.value.find(node => node.id === edge.to)

    if (!from || !to) return

    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.strokeStyle = getValue(edgeColor, edge)
    ctx.lineWidth = getValue(edgeWidth, edge)
    ctx.stroke()
    ctx.closePath()
  }

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
    edges.value.forEach(edge => drawEdge(ctx, edge))
    nodes.value.forEach(node => drawNode(ctx, node))
  }

  const mouseEvents: Partial<MouseEventMap> = {
    click: (ev: MouseEvent) => {
      eventBus.onClick.forEach(fn => fn(ev))
    },
    mousedown: (ev: MouseEvent) => {
      eventBus.onMouseDown.forEach(fn => fn(ev))
      const node = getNodeByCoordinates(ev.offsetX, ev.offsetY)
      setFocusedNode(node?.id)
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

  const drawGraphInterval = setInterval(() => {
    if (!canvas.value) return
    const ctx = canvas.value.getContext('2d')
    if (ctx) {
      draw(ctx)
    }
  }, 1000 / 60 /* 60fps */)

  const stopClickOutsideListener = onClickOutside(canvas, () => setFocusedNode(undefined))

  onMounted(() => {
    for (const [event, listeners] of Object.entries(mouseEvents) as MouseEventEntries) {
      canvas.value.addEventListener(event, listeners)
    }

    for (const [event, listeners] of Object.entries(keyboardEvents) as KeyboardEventEntries) {
      document.addEventListener(event, listeners)
    }
  })

  onUnmounted(() => {
    for (const [event, listeners] of Object.entries(mouseEvents) as MouseEventEntries) {
      canvas.value.removeEventListener(event, listeners)
    }

    for (const [event, listeners] of Object.entries(keyboardEvents) as KeyboardEventEntries) {
      document.removeEventListener(event, listeners)
    }

    clearInterval(drawGraphInterval)
    stopClickOutsideListener()
  })

  const addNode = (node: { id?: number, x: number, y: number }, focusNode = true) => {
    const newNode = {
      id: node.id || nodeIdCount++,
      x: node.x,
      y: node.y,
    }
    nodes.value.push(newNode)
    eventBus.onStructureChange.forEach(fn => fn(nodes.value, edges.value))
    if (focusNode) setFocusedNode(newNode.id)
  }

  const moveNode = (id: number, x: number, y: number) => {
    const node = nodes.value.find(node => node.id === id)
    if (node) {
      node.x = x
      node.y = y
    }
  }

  const getNode = (id: number) => {
    return nodes.value.find(node => node.id === id)
  }

  const getNodeByCoordinates = (x: number, y: number) => {
    return nodes.value.find(node => {
      return Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2) < getValue(nodeSize, node)
    })
  }

  const removeNode = (id: number) => {
    const index = nodes.value.findIndex(node => node.id === id)
    if (index === -1) return
    nodes.value.splice(index, 1)
    edges.value = edges.value.filter(edge => edge.from !== id && edge.to !== id)
    eventBus.onStructureChange.forEach(fn => fn(nodes.value, edges.value))
  }

  const addEdge = (edge: Edge) => {
    edges.value.push(edge)
    eventBus.onStructureChange.forEach(fn => fn(nodes.value, edges.value))
  }

  const removeEdge = (edge: Edge) => {
    const edgeIndex = edges.value.findIndex(e => e.from === edge.from && e.to === edge.to)
    if (edgeIndex === -1) return
    edges.value.splice(edgeIndex, 1)
    eventBus.onStructureChange.forEach(fn => fn(nodes.value, edges.value))
  }

  const setFocusedNode = (newNodeId: number | undefined) => {
    if (focusedNodeId.value === newNodeId) return
    const oldNode = focusedNodeId.value ? getNode(focusedNodeId.value) : undefined
    const newNode = newNodeId ? getNode(newNodeId) : undefined
    focusedNodeId.value = newNodeId
    eventBus.onNodeFocusChange.forEach(fn => fn(newNode, oldNode))
  }

  defaultEdges.forEach((edge) => addEdge(edge))
  defaultNodes.forEach((node) => addNode(node, false))

  const subscribe = <T extends keyof UseGraphEventBus>(
    event: T,
    fn: UseGraphEventBusCallbackMappings[T]
  ) => {
    console.log('event', event)
    eventBus[event].push(fn)
  }

  const extendEventBus = <
    K extends string,
    E extends Function = () => void,
    T extends UseGraphEventBus = UseGraphEventBus,
  >(
    eventBus: T,
    newEventKey: K,
  ) => {
    const newEventBus = {
      ...eventBus,
      [newEventKey]: [],
    } as T & { [_ in K]: E[] }

    const newSubscribe = ((event: keyof T | K, fn: E) => {
      newEventBus[event].push(fn)
    })

    return {
      newEventBus,
      newSubscribe,
    }
  }

  return {
    nodes,
    edges,
    addNode,
    moveNode,
    getNode,
    getNodeByCoordinates,
    removeNode,
    addEdge,
    removeEdge,
    getFocusedNode: () => focusedNodeId.value ? getNode(focusedNodeId.value) : undefined,
    getFocusedNodeId: () => focusedNodeId.value,
    setFocusedNode,
    eventBus,
    extendEventBus,
    subscribe,
  }
}

export const useGraphWithNodeEvents = (
  canvas: Ref<HTMLCanvasElement>,
  options: GraphOptions = {}
) => {
  const graph = useGraph(canvas, options)
  const {
    newEventBus,
    newSubscribe
  } = graph.extendEventBus<'onNodeHoverChange', (node: Node | undefined) => void>(
    graph.eventBus,
    'onNodeHoverChange'
  )

  newSubscribe('onNodeHoverChange', (node) => {
    console.log('node', node?.id)
  });

  return {
    ...graph,
    subscribe: newSubscribe,
    eventBus: newEventBus,
  }
}

export const useDraggableGraph = (canvas: Ref<HTMLCanvasElement>, options: GraphOptions = {}) => {

  const graph = useGraph(canvas, options)
  const nodeBeingDragged = ref<Node | null>(null)
  const startingCoordinatesOfDrag = ref<{ x: number, y: number } | null>(null)

  const beginDrag = (ev: MouseEvent) => {
    const { offsetX, offsetY } = ev;
    startingCoordinatesOfDrag.value = { x: offsetX, y: offsetY }
    const node = graph.getNodeByCoordinates(offsetX, offsetY);
    if (node) {
      nodeBeingDragged.value = node;
    }
  }

  const endDrag = () => {
    nodeBeingDragged.value = null;
  }

  const drag = (ev: MouseEvent) => {
    if (!nodeBeingDragged.value || !startingCoordinatesOfDrag.value) return
    const { offsetX, offsetY } = ev;
    const dx = offsetX - startingCoordinatesOfDrag.value.x;
    const dy = offsetY - startingCoordinatesOfDrag.value.y;
    graph.moveNode(nodeBeingDragged.value.id, nodeBeingDragged.value.x + dx, nodeBeingDragged.value.y + dy);
    startingCoordinatesOfDrag.value = { x: offsetX, y: offsetY }
  }

  graph.subscribe('onMouseDown', beginDrag)
  graph.subscribe('onMouseUp', endDrag)
  graph.subscribe('onMouseMove', drag)

  return graph
}

export const useUserEditableGraph = (
  canvas: Ref<HTMLCanvasElement>,
  options: GraphOptions = {}
) => {
  const graph = useDraggableGraph(canvas, options)

  graph.subscribe('onDblClick', (ev) => {
    const { offsetX, offsetY } = ev
    graph.addNode({ x: offsetX, y: offsetY })
  })

  graph.subscribe('onKeydown', (ev) => {
    const focusedNodeId = graph.getFocusedNodeId()
    if (ev.key === 'Backspace' && focusedNodeId) graph.removeNode(focusedNodeId)
  });

  return graph
}

export const useWeirdDraggableGraph = (
  canvas: Ref<HTMLCanvasElement>,
  options: GraphOptions = {}
) => useDraggableGraph(canvas, {
  ...themes.weird,
  ...options,
})

export const usePersistentDraggableGraph = (
  canvas: Ref<HTMLCanvasElement>,
  storageKey: string,
  options: GraphOptions = {}
) => {
  const graph = useDraggableGraph(canvas, options)

  // TODO: load the nodes and edges in properly and not just by mem ref
  useLocalStorage(storageKey + '-nodes', graph.nodes)
  useLocalStorage(storageKey + '-edges', graph.edges)

  options.onStructureChange?.(graph.nodes.value, graph.edges.value)

  return graph
}

export const useDarkUserEditableGraph = (
  canvas: Ref<HTMLCanvasElement>,
  options: GraphOptions = {}
) => {
  const g = useUserEditableGraph(canvas, {
    ...themes.dark,
    ...options,
  })

  // g.subscribe('onNodeHoverChange', (nodeBeingHovered) => {
  //   console.log('nodeBeingHovered', nodeBeingHovered?.id)
  // })

  return g
}

export type Graph = ReturnType<typeof useGraph>