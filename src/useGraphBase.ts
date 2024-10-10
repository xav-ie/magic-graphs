import {
  ref,
  onMounted,
  onBeforeUnmount,
  computed,
  type Ref
} from 'vue'
import { onClickOutside } from '@vueuse/core';
import type {
  NodeGetterOrValue,
  EdgeGetterOrValue,
  GNode,
  GEdge,
  MouseEventMap,
  KeyboardEventMap,
  MouseEventEntries,
  KeyboardEventEntries
} from './useGraphTypes'
import { generateSubscriber, getValue, generateId } from './useGraphHelpers';
import { drawCircleWithCtx, drawLineWithCtx } from './shapeHelpers';
import { isInCircle, isInLine } from './hitboxHelpers';

export type UseGraphEventBusCallbackMappings = {
  /* graph dataflow events */
  onStructureChange: (nodes: GNode[], edges: GEdge[]) => void;
  onNodeFocusChange: (newNode: GNode | undefined, oldNode: GNode | undefined) => void;
  onNodeAdded: (node: GNode) => void;
  onNodeRemoved: (node: GNode) => void;
  onRepaint: (ctx: CanvasRenderingContext2D) => void;
  onNodeHoverChange: (newNode: GNode | undefined, oldNode: GNode | undefined) => void;

  /* canvas dom events */
  onClick: (ev: MouseEvent) => void;
  onMouseDown: (ev: MouseEvent) => void;
  onMouseUp: (ev: MouseEvent) => void;
  onMouseMove: (ev: MouseEvent) => void;
  onDblClick: (ev: MouseEvent) => void;

  /* global dom events */
  onKeydown: (ev: KeyboardEvent) => void;
}

type DrawItem = {
  type: 'node',
  data: GNode,
} | {
  type: 'edge',
  data: GEdge,
}

export type MappingsToEventBus<T> = Record<keyof T, any[]>
export type UseGraphEventBus = MappingsToEventBus<UseGraphEventBusCallbackMappings>

export type GraphOptions = {
  nodeRadius: NodeGetterOrValue<number>,
  nodeBorderWidth: NodeGetterOrValue<number>,
  nodeColor: NodeGetterOrValue<string>,
  nodeBorderColor: NodeGetterOrValue<string>,
  nodeFocusColor: NodeGetterOrValue<string>,
  nodeFocusBorderColor: NodeGetterOrValue<string>,
  nodeText: NodeGetterOrValue<string>,
  nodeTextSize: NodeGetterOrValue<number>,
  nodeTextColor: NodeGetterOrValue<string>,
  edgeColor: EdgeGetterOrValue<string>,
  edgeWidth: EdgeGetterOrValue<number>,
}

const defaultOptions: GraphOptions = {
  nodeRadius: 35,
  nodeBorderWidth: 8,
  nodeColor: 'white',
  nodeBorderColor: 'black',
  nodeFocusBorderColor: 'blue',
  nodeFocusColor: 'white',
  nodeText: ({ label }: GNode) => label,
  nodeTextSize: 24,
  nodeTextColor: 'black',
  edgeColor: 'black',
  edgeWidth: 10,
}

export const useGraph =(
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  optionsArg: Partial<GraphOptions> = {}
) => {

  const options = ref({
    ...defaultOptions,
    ...optionsArg,
  })

  const nodes = ref<GNode[]>([])
  const edges = ref<GEdge[]>([])
  const focusedNodeId = ref<GNode['id'] | undefined>()

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

  const subscribe = generateSubscriber(eventBus)

  const drawNode = (ctx: CanvasRenderingContext2D, node: GNode) => {
    const {
      nodeFocusColor,
      nodeColor,
      nodeBorderColor,
      nodeFocusBorderColor,
      nodeRadius,
      nodeBorderWidth,
      nodeText,
      nodeTextSize,
      nodeTextColor
    } = options.value

    const fillColor = node.id === focusedNodeId.value ? nodeFocusColor : nodeColor
    const borderColor = node.id === focusedNodeId.value ? nodeFocusBorderColor : nodeBorderColor

    const drawCircle = drawCircleWithCtx(ctx)
    drawCircle({
      at: {
        x: node.x,
        y: node.y
      },
      radius: getValue(nodeRadius, node),
      color: getValue(fillColor, node),
      stroke: {
        color: getValue(borderColor, node),
        width: getValue(nodeBorderWidth, node),
      },
      text: {
        content: getValue(nodeText, node),
        fontSize: getValue(nodeTextSize, node),
        fontWeight: 'bold',
        color: getValue(nodeTextColor, node),
      }
    })
  }

  const getFromToNodes = (edge: GEdge) => {
    // using label when its ID that should be used but if i use ID, we create a new property that
    // predefined nodes and edges outside of the graph instance do not know about!
    const from = nodes.value.find(node => node.label === edge.from)
    const to = nodes.value.find(node => node.label === edge.to)
    return { from, to }
  }

  const drawEdge = (ctx: CanvasRenderingContext2D, edge: GEdge) => {
    const { from, to } = getFromToNodes(edge)
    if (!from || !to) return

    const drawLine = drawLineWithCtx(ctx)

    drawLine({
      start: { x: from.x, y: from.y },
      end: { x: to.x, y: to.y },
      color: getValue(options.value.edgeColor, edge),
      width: getValue(options.value.edgeWidth, edge),
    })
  }

  const drawItems = computed(() => {
    // console.log('drawItems computed')
    const nodeDrawItems = nodes.value.map(node => ({ type: 'node', data: node } as const))
    const edgeDrawItems = edges.value.map(edge => ({ type: 'edge', data: edge } as const))
    return [...edgeDrawItems, ...nodeDrawItems,]
  })

  const mouseEvents: Partial<MouseEventMap> = {
    click: (ev: MouseEvent) => {
      console.log(getDrawItemsByCoordinates(ev.offsetX, ev.offsetY))
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
      ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
      for (const item of drawItems.value) {
        if (item.type === 'node') drawNode(ctx, item.data)
        if (item.type === 'edge') drawEdge(ctx, item.data)
      }
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
    if (focusNode) setFocusedNode(newNode.id)
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

  const getDrawItemsByCoordinates = (x: number, y: number) => {
    return drawItems.value.filter(item => {
      if (item.type === 'node') {
        const nodeRadius = getValue(options.value.nodeRadius, item.data)
        const nodeBorderWidth = getValue(options.value.nodeBorderWidth, item.data)
        const point = { x, y }
        const nodeCircle = { x: item.data.x, y: item.data.y, radius: nodeRadius + nodeBorderWidth }
        return isInCircle(point, nodeCircle)
      } if (item.type === 'edge') {
        const { from, to } = getFromToNodes(item.data)
        if (!from || !to) return false
        const point = { x, y }
        return isInLine(point, {
          start: { x: from.x, y: from.y },
          end: { x: to.x, y: to.y },
          width: getValue(options.value.edgeWidth, item.data),
        })
      }
    })
  }

  /*
    @param x - the x coordinate
    @param y - the y coordinate
    @param buffer - the buffer is used to increase the hit box of a node beyond its radius
    @returns the node that is closest to the given coordinates
  */
  const getNodeByCoordinates = (x: number, y: number, buffer = 0): GNode | undefined => {
    /* @ts-expect-error - findLast proto not typed */
    return getDrawItemsByCoordinates(x, y).findLast(item => item.type === 'node')?.data
  }

  const removeNode = (id: GNode['id']) => {
    const index = nodes.value.findIndex(node => node.id === id)
    if (index === -1) return
    const removedNode = nodes.value[index]
    nodes.value.splice(index, 1)
    edges.value = edges.value.filter(edge => edge.from !== id && edge.to !== id)
    eventBus.onStructureChange.forEach(fn => fn(nodes.value, edges.value))
    eventBus.onNodeRemoved.forEach(fn => fn(removedNode))
  }

  const addEdge = (edge: Omit<GEdge, 'id'>) => {
    edges.value.push({ ...edge, id: generateId() })
    eventBus.onStructureChange.forEach(fn => fn(nodes.value, edges.value))
    return edge
  }

  const removeEdge = (edge: GEdge) => {
    const edgeIndex = edges.value.findIndex(e => e.from === edge.from && e.to === edge.to)
    if (edgeIndex === -1) return
    edges.value.splice(edgeIndex, 1)
    eventBus.onStructureChange.forEach(fn => fn(nodes.value, edges.value))
  }

  const setFocusedNode = (newNodeId: GNode['id'] | undefined) => {
    if (focusedNodeId.value === newNodeId) return
    const oldNode = focusedNodeId.value ? getNode(focusedNodeId.value) : undefined
    const newNode = newNodeId ? getNode(newNodeId) : undefined
    focusedNodeId.value = newNodeId
    eventBus.onNodeFocusChange.forEach(fn => fn(newNode, oldNode))
  }

  let currHoveredNode: GNode | undefined = undefined
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