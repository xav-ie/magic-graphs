import { ref, onMounted, onBeforeUnmount, type Ref, readonly } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { onClickOutside } from '@vueuse/core'
import { themes } from './themes'
import { isInCircle } from './hitboxHelpers'
import { drawCircle } from './shapeHelpers'

type MaybeGetter<T, K extends any[] = []> = T | ((...arg: K) => T)
type NodeGetterOrValue<T> = MaybeGetter<T, [Node]>
type EdgeGetterOrValue<T> = MaybeGetter<T, [Edge]>

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
  onNodeAdded: (node: Node) => void;
  onNodeRemoved: (node: Node) => void;
  onRepaint: (ctx: CanvasRenderingContext2D) => void;
  onNodeHoverChange: (newNode: Node | undefined, oldNode: Node | undefined) => void;

  /* canvas dom events */
  onClick: (ev: MouseEvent) => void;
  onMouseDown: (ev: MouseEvent) => void;
  onMouseUp: (ev: MouseEvent) => void;
  onMouseMove: (ev: MouseEvent) => void;
  onDblClick: (ev: MouseEvent) => void;

  /* global dom events */
  onKeydown: (ev: KeyboardEvent) => void;
}

type MappingsToEventBus<T> = Record<keyof T, any[]>
type UseGraphEventBus = MappingsToEventBus<UseGraphEventBusCallbackMappings>

export const getValue = <T, K extends any[]>(value: MaybeGetter<T, K>, ...args: K) => {
  if (typeof value === 'function') {
    return (value as (...args: K) => T)(...args)
  }
  return value
}

/*
  generates a "subscribe" function for the event bus
  in order to registering new events
*/
const generateSubscriber = <T extends UseGraphEventBusCallbackMappings>(
  eventBus: MappingsToEventBus<T>
) => <K extends keyof T>(
  event: K,
  fn: T[K]
) => eventBus[event].push(fn)

export type GraphOptions = {
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
}

const defaultOptions: GraphOptions = {
  nodeSize: 35,
  nodeBorderSize: 8,
  nodeColor: 'white',
  nodeBorderColor: 'black',
  nodeFocusBorderColor: 'blue',
  nodeFocusColor: 'white',
  nodeText: (node: Node) => node.id.toString(),
  nodeTextSize: 24,
  nodeTextColor: 'black',
  edgeColor: 'black',
  edgeWidth: 10,
}

export type Node = {
  id: number,
  x: number,
  y: number,
}

export type Edge = {
  to: number,
  from: number,
}

export const useGraph =(
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  optionsArg: Partial<GraphOptions> = {}
) => {

  const options = ref({
    ...defaultOptions,
    ...optionsArg,
  })

  const nodes = ref<Node[]>([])
  const edges = ref<Edge[]>([])
  const focusedNodeId = ref<Node['id'] | undefined>()

  const eventBus: UseGraphEventBus = {
    onStructureChange: [],
    onNodeFocusChange: [],
    onNodeAdded: [],
    onNodeRemoved: [],
    onRepaint: [],
    onNodeHoverChange: [],


    /* canvas element events */
    onClick: [],
    onMouseDown: [],
    onMouseUp: [],
    onMouseMove: [],
    onDblClick: [],

    onKeydown: [],
  }

  const drawNode = (ctx: CanvasRenderingContext2D, node: Node) => {
    // draw node
    ctx.beginPath()
    ctx.arc(node.x, node.y, getValue(options.value.nodeSize, node), 0, Math.PI * 2)
    const fillColor = node.id === focusedNodeId.value ? options.value.nodeFocusColor : options.value.nodeColor
    ctx.fillStyle = getValue(fillColor, node)
    ctx.fill()

    // draw border
    const borderColor = node.id === focusedNodeId.value ? options.value.nodeFocusBorderColor : options.value.nodeBorderColor
    ctx.strokeStyle = getValue(borderColor, node)
    ctx.lineWidth = getValue(options.value.nodeBorderSize, node)
    ctx.stroke()
    ctx.closePath()

    // draw text label
    ctx.font = `bold ${getValue(options.value.nodeTextSize, node)}px Arial`
    ctx.fillStyle = getValue(options.value.nodeTextColor, node)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(getValue(options.value.nodeText, node), node.x, node.y)
  }

  const drawEdge = (ctx: CanvasRenderingContext2D, edge: Edge) => {
    const from = nodes.value.find(node => node.id === edge.from)
    const to = nodes.value.find(node => node.id === edge.to)

    if (!from || !to) return

    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.strokeStyle = getValue(options.value.edgeColor, edge)
    ctx.lineWidth = getValue(options.value.edgeWidth, edge)
    ctx.stroke()
    ctx.closePath()
  }

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height)
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
      eventBus.onRepaint.forEach(fn => fn(ctx))
    }
  }, 1000 / 60 /* 60fps */)

  const stopClickOutsideListener = onClickOutside(canvas, () => setFocusedNode(undefined))

  onMounted(() => {
    if (!canvas.value) {
      throw new Error('Canvas element not found')
    }

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

  // eventually move this stuff out of here
  const getRandomBetweenRange = (min: number, max: number) => Math.round(Math.random() * (max - min) + min);
  const getRandomPointOnCanvas = (canvas: HTMLCanvasElement) => ({
    x: getRandomBetweenRange(50, canvas.width - 50),
    y: getRandomBetweenRange(50, canvas.height - 50),
  });

  const getNewNodeId = () => {
    const ids = nodes.value.map(node => node.id)
    let id = 1
    while (ids.includes(id)) id++
    return id
  }

  const addNode = (node: Partial<Node>, focusNode = true) => {
    const { x, y } = canvas.value ? getRandomPointOnCanvas(canvas.value) : { x: 0, y: 0 }
    const newNode = {
      id: node.id ?? getNewNodeId(),
      x: node.x ?? x,
      y: node.y ?? y,
    }
    nodes.value.push(newNode)
    eventBus.onStructureChange.forEach(fn => fn(nodes.value, edges.value))
    eventBus.onNodeAdded.forEach(fn => fn(newNode))
    if (focusNode) setFocusedNode(newNode.id)
    return newNode
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

  /*
    @param x - the x coordinate
    @param y - the y coordinate
    @param buffer - the buffer is used to increase the hit box of a node beyond its radius
    @returns the node that is closest to the given coordinates
  */
  const getNodeByCoordinates = (x: number, y: number, buffer = 0) => {
    /* @ts-expect-error - findLast is not in the types */
    return nodes.value.findLast(node => {
      const nodeRadius = getValue(options.value.nodeSize, node)
      const nodeBorderRadius = getValue(options.value.nodeBorderSize, node)
      const point = { x, y }
      const nodeCircle = { x: node.x, y: node.y, radius: nodeRadius + nodeBorderRadius + buffer }
      return isInCircle(point, nodeCircle)
    })
  }

  const removeNode = (id: number) => {
    const index = nodes.value.findIndex(node => node.id === id)
    if (index === -1) return
    const removedNode = nodes.value[index]
    nodes.value.splice(index, 1)
    edges.value = edges.value.filter(edge => edge.from !== id && edge.to !== id)
    eventBus.onStructureChange.forEach(fn => fn(nodes.value, edges.value))
    eventBus.onNodeRemoved.forEach(fn => fn(removedNode))
  }

  const addEdge = (edge: Edge) => {
    edges.value.push(edge)
    eventBus.onStructureChange.forEach(fn => fn(nodes.value, edges.value))
    return edge
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

  const subscribe = generateSubscriber(eventBus)

  let currHoveredNode: Node | undefined = undefined
  subscribe('onMouseMove', (ev) => {
    const node = getNodeByCoordinates(ev.offsetX, ev.offsetY)
    if (node === currHoveredNode) return
    eventBus.onNodeHoverChange.forEach(fn => fn(node, currHoveredNode))
    currHoveredNode = node
  })

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
    subscribe,
    options,
  }
}

type WithDragEvents<T extends UseGraphEventBusCallbackMappings> = T & {
  onNodeDragStart: (node: Node) => void;
  onNodeDragEnd: (node: Node) => void;
}

type MappingsWithDragAndNodeEvents = WithDragEvents<UseGraphEventBusCallbackMappings>

export const useDraggableGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<GraphOptions> = {}
) => {

  const graph = useGraph(canvas, options)
  const draggingEnabled = ref(true)

  const eventBus: MappingsToEventBus<MappingsWithDragAndNodeEvents> = {
    ...graph.eventBus,
    onNodeDragStart: [],
    onNodeDragEnd: [],
  }

  const subscribe = generateSubscriber(eventBus)

  const nodeBeingDragged = ref<Node | undefined>()
  const startingCoordinatesOfDrag = ref<{ x: number, y: number } | undefined>()

  const beginDrag = (ev: MouseEvent) => {
    if (!draggingEnabled.value) return
    const { offsetX, offsetY } = ev;
    startingCoordinatesOfDrag.value = { x: offsetX, y: offsetY }
    const node = graph.getNodeByCoordinates(offsetX, offsetY);
    if (!node) return
    nodeBeingDragged.value = node;
    eventBus.onNodeDragStart.forEach(fn => fn(node))
  }

  const endDrag = () => {
    if (!nodeBeingDragged.value) return
    eventBus.onNodeDragEnd.forEach(fn => fn(nodeBeingDragged.value))
    nodeBeingDragged.value = undefined;
  }

  const drag = (ev: MouseEvent) => {
    if (
      !nodeBeingDragged.value ||
      !startingCoordinatesOfDrag.value ||
      !draggingEnabled.value
    ) return
    const { offsetX, offsetY } = ev;
    const dx = offsetX - startingCoordinatesOfDrag.value.x;
    const dy = offsetY - startingCoordinatesOfDrag.value.y;
    graph.moveNode(nodeBeingDragged.value.id, nodeBeingDragged.value.x + dx, nodeBeingDragged.value.y + dy);
    startingCoordinatesOfDrag.value = { x: offsetX, y: offsetY }
  }

  subscribe('onNodeHoverChange', (node) => {
    if (!node || nodeBeingDragged.value) return
    const nodeIndex = graph.nodes.value.findIndex(n => n.id === node.id)
    if (nodeIndex === -1) return
    graph.nodes.value.splice(nodeIndex, 1)
    graph.nodes.value.push(node)
  })

  subscribe('onMouseDown', beginDrag)
  subscribe('onMouseUp', endDrag)
  subscribe('onMouseMove', drag)

  return {
    ...graph,
    eventBus,
    subscribe,
    nodeBeingDragged: readonly(nodeBeingDragged),
    draggingEnabled,
  }
}

type MiniNodeGraphOptions<T extends GraphOptions = GraphOptions> = T & {
  miniNodeRadius: NodeGetterOrValue<number>;
  miniNodeColorWhenNodeFocused: NodeGetterOrValue<string>;
  miniNodeColor: NodeGetterOrValue<string>;
}

type MiniNode = {
  x: number,
  y: number,
  direction: 'north' | 'east' | 'south' | 'west',
}

export const useDraggableMiniNodeGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<MiniNodeGraphOptions> = {}
) => {

  const graph = useDraggableGraph(canvas, options)
  const parentNode = ref<Node | undefined>()
  const activeMiniNode = ref<MiniNode | undefined>()

  const {
    // default mini node radius scales at 2 root r
    miniNodeRadius = (node) => Math.sqrt(getValue(graph.options.value.nodeSize, node)) * 2,
    miniNodeColorWhenNodeFocused = graph.options.value.nodeFocusBorderColor,
    miniNodeColor = 'black',
  } = options

  const getMiniNodes = (nodeRadius: number, nodeBorderWidth: number): MiniNode[] => {
    if (!parentNode.value) return []
    const miniNodeRadiusVal = getValue(miniNodeRadius, parentNode.value)
    const offset = nodeRadius - (miniNodeRadiusVal / 3) + (nodeBorderWidth / 2)
    return [
      {
        x: parentNode.value.x,
        y: parentNode.value.y - offset,
        direction: 'north',
      },
      {
        x: parentNode.value.x + offset,
        y: parentNode.value.y,
        direction: 'east',
      },
      {
        x: parentNode.value.x,
        y: parentNode.value.y + offset,
        direction: 'south',
      },
      {
        x: parentNode.value.x - offset,
        y: parentNode.value.y,
        direction: 'west',
      },
    ]
  }

  const drawMiniNodes = (ctx: CanvasRenderingContext2D) => {
    if (!parentNode.value || graph.nodeBeingDragged.value) return

    // get the radius of the mini nodes
    const nodeRadius = getValue(graph.options.value.nodeSize, parentNode.value)
    const nodeBorderRadius = getValue(graph.options.value.nodeBorderSize, parentNode.value)
    const miniNodeRadiusVal = getValue(miniNodeRadius, parentNode.value)

    // get the color of the mini nodes
    const normalMiniNodeColorVal = getValue(miniNodeColor, parentNode.value)
    const focusedMiniNodeColorVal = getValue(miniNodeColorWhenNodeFocused, parentNode.value)
    const isParentFocused = parentNode.value.id === graph.getFocusedNodeId()
    const miniNodeColorVal = isParentFocused ? focusedMiniNodeColorVal : normalMiniNodeColorVal

    const miniNodes = getMiniNodes(nodeRadius, nodeBorderRadius)
    if (activeMiniNode.value) {


    }


    for (const miniNode of miniNodes) {
      drawCircle(ctx, {
        x: miniNode.x,
        y: miniNode.y,
        radius: miniNodeRadiusVal,
        color: miniNodeColorVal,
      })
    }
  }

  const getMiniNode = (x: number, y: number) => {
    if (!parentNode.value) return false
    const nodeRadius = getValue(graph.options.value.nodeSize, parentNode.value)
    const nodeBorderRadius = getValue(graph.options.value.nodeBorderSize, parentNode.value)
    const miniNodes = getMiniNodes(nodeRadius, nodeBorderRadius)
    return miniNodes.find((miniNode) => {
      if (!parentNode.value) return false
      const point = { x, y }
      return isInCircle(point, {
        x: miniNode.x,
        y: miniNode.y,
        radius: getValue(miniNodeRadius, parentNode.value),
      })
    })
  }

  graph.subscribe('onNodeHoverChange', (node) => {
    if (!node) return
    parentNode.value = node
  })

  graph.subscribe('onMouseDown', (ev) => {
    const miniNode = getMiniNode(ev.offsetX, ev.offsetY)
    console.log('mousedown', miniNode)
    if (!miniNode) return
    activeMiniNode.value = miniNode
    graph.draggingEnabled.value = false
  })

  graph.subscribe('onMouseMove', (ev) => {
    if (!activeMiniNode.value) return

  })

  graph.subscribe('onRepaint', drawMiniNodes)

  graph.subscribe('onNodeRemoved', (node) => {
    if (parentNode.value?.id === node.id) parentNode.value = undefined
  })

  return graph
}

type UserEditableGraphOptions = MiniNodeGraphOptions
export const useUserEditableGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<UserEditableGraphOptions> = {}
) => {

  const graph = useDraggableMiniNodeGraph(canvas, options)

  graph.subscribe('onDblClick', (ev) => {
    const { offsetX, offsetY } = ev
    const node = graph.addNode({ x: offsetX, y: offsetY })
    graph.eventBus.onNodeHoverChange.forEach(fn => fn(node))
  })

  graph.subscribe('onKeydown', (ev) => {
    const focusedNodeId = graph.getFocusedNodeId()
    if (ev.key === 'Backspace' && focusedNodeId) graph.removeNode(focusedNodeId)
  });

  return graph
}

export const useWeirdDraggableGraph = (
  canvas: Ref<HTMLCanvasElement>,
  options: Partial<GraphOptions> = {}
) => useDraggableGraph(canvas, {
  ...themes.weird,
  ...options,
})

export const usePersistentDraggableGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  storageKey: string,
  options: Partial<GraphOptions> = {}
) => {

  const graph = useDraggableGraph(canvas, options)

  // TODO: load the nodes and edges in properly and not just by mem ref
  useLocalStorage(storageKey + '-nodes', graph.nodes)
  useLocalStorage(storageKey + '-edges', graph.edges)

  return graph
}

export const useDarkUserEditableGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<UserEditableGraphOptions> = {}
) => {

  const g = useUserEditableGraph(canvas, {
    ...themes.dark,
    ...options,
  })

  return g
}

export type Graph = ReturnType<typeof useGraph>