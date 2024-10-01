import { ref, onMounted, type Ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { onClickOutside } from '@vueuse/core'
import { themes } from './themes'

type GetterOrValue<T, K extends any[] = []> = T | ((...arg: K) => T)
type NodeGetterOrValue<T> = GetterOrValue<T, [Node]>
type EdgeGetterOrValue<T> = GetterOrValue<T, [Edge]>

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
  const focusedNodeId = ref<Node['id'] | null>(null)

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

  onMounted(() => {
    const ctx = canvas.value.getContext('2d')
    if (ctx) {
      draw(ctx)
    }

    canvas.value.addEventListener('dblclick', (ev) => {
      const { offsetX, offsetY } = ev
      addNode({ x: offsetX, y: offsetY })
    })

    canvas.value.addEventListener('mousedown', (ev) => {
      const node = getNodeByCoordinates(ev.offsetX, ev.offsetY)
      if (!node) return focusedNodeId.value = null
      focusedNodeId.value = node.id
    })

    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Backspace' && focusedNodeId.value) {
        removeNode(focusedNodeId.value)
      }
    })

    onClickOutside(canvas, () => focusedNodeId.value = null)

    setInterval(() => {
      const ctx = canvas.value.getContext('2d')
      if (ctx) {
        draw(ctx)
      }
    }, 1000 / 60 /* 60fps */)
  })

  const addNode = (node: Partial<Node>, focusNode = true) => {
    const newNode = {
      id: node.id || nodeIdCount++,
      x: node.x || 100,
      y: node.y || 100,
    }
    nodes.value.push(newNode)
    options.onStructureChange?.(nodes.value, edges.value)
    if (focusNode) focusedNodeId.value = newNode.id
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
    options.onStructureChange?.(nodes.value, edges.value)
  }

  const addEdge = (edge: Edge) => {
    edges.value.push(edge)
    options.onStructureChange?.(nodes.value, edges.value)
  }

  const removeEdge = (edge: Edge) => {
    const edgeIndex = edges.value.findIndex(e => e.from === edge.from && e.to === edge.to)
    if (edgeIndex === -1) return
    edges.value.splice(edgeIndex, 1)
    options.onStructureChange?.(nodes.value, edges.value)
  }

  defaultEdges.forEach((edge) => addEdge(edge))
  defaultNodes.forEach((node) => addNode(node, false))

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

  onMounted(() => {
    canvas.value.addEventListener('mousedown', beginDrag)
    canvas.value.addEventListener('mouseup', endDrag)
    canvas.value.addEventListener('mousemove', drag)
  })

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

export const useDarkDraggableGraph = (
  canvas: Ref<HTMLCanvasElement>,
  options: GraphOptions = {}
) => useDraggableGraph(canvas, {
  ...themes.dark,
  ...options,
})