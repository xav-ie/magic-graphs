import {
  ref,
  onMounted,
  onBeforeUnmount,
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
  KeyboardEventEntries,
  SchemaItem
} from './types'
import { generateSubscriber, getValue, generateId } from './useGraphHelpers';
import { drawShape } from '../shapes/draw';
import { hitboxes } from '../shapes/hitboxes';
import type { Circle, Line } from '../shapes/types';

export type UseGraphEventBusCallbackMappings = {
  /* graph dataflow events */
  onStructureChange: (nodes: GNode[], edges: GEdge[]) => void;
  onNodeFocusChange: (newNode: GNode | undefined, oldNode: GNode | undefined) => void;
  onNodeAdded: (node: GNode) => void;
  onNodeRemoved: (node: GNode) => void;
  /*
    @description - this event is called when the graph needs to be redrawn
    WARNING: items drawn to the canvas using ctx won't be tied to the graph event architecture.
    Use updateAggregator if you need drawn item to integrate with graph apis
  */
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
  optionsArg: Partial<GraphOptions> = {},
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

  const getNodeSchematic = (node: GNode): Circle => {
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

    return {
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
    }
  }

  const getFromToNodes = (edge: GEdge) => {
    // using label when its ID that should be used but if i use ID, we create a new property that
    // predefined nodes and edges outside of the graph instance do not know about!
    const from = nodes.value.find(node => node.label === edge.from)
    const to = nodes.value.find(node => node.label === edge.to)
    return { from, to }
  }

  const getEdgeSchematic = (edge: GEdge): Line | undefined => {
    const { from, to } = getFromToNodes(edge)
    if (!from || !to) return

    return {
      start: { x: from.x, y: from.y },
      end: { x: to.x, y: to.y },
      color: getValue(options.value.edgeColor, edge),
      width: getValue(options.value.edgeWidth, edge),
    }
  }

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

  subscribe('onMouseDown', (ev) => {
    const node = getNodeByCoordinates(ev.offsetX, ev.offsetY)
    setFocusedNode(node?.id)
  })

  const aggregator = ref<SchemaItem[]>([])
  const updateAggregator: ((aggregator: SchemaItem[]) => SchemaItem[])[] = []

  updateAggregator.push((aggregator) => {
    const nodeSchemaItems = nodes.value.map((node, i) => ({
      id: node.id,
      graphType: 'node',
      schemaType: 'circle',
      schema: getNodeSchematic(node),
      priority: i + 100,
    } as const))
    const edgeSchemaItems = edges.value.map((edge, i) => ({
      id: edge.id,
      graphType: 'edge',
      schemaType: 'line',
      schema: getEdgeSchematic(edge),
      priority: i,
    } as const)).filter(({ schema }) => schema) as SchemaItem[]
    aggregator.push(...edgeSchemaItems)
    aggregator.push(...nodeSchemaItems)
    return aggregator
  })

  const drawGraphInterval = setInterval(() => {
    if (!canvas.value) return
    const ctx = canvas.value.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

      const evaluateAggregator = updateAggregator.reduce<SchemaItem[]>((acc, fn) => fn(acc), [])
      aggregator.value = [...evaluateAggregator.sort((a, b) => a.priority - b.priority)]

      const { drawLine, drawCircle } = drawShape(ctx)
      for (const item of aggregator.value) {
        if (item.schemaType === 'circle') {
          drawCircle(item.schema)
        } else if (item.schemaType === 'line') {
          drawLine(item.schema)
        }
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
    const point = { x, y }
    const { isInCircle, isInLine } = hitboxes(point)
    return aggregator.value.filter(item => {
      if (item.schemaType === 'circle') {
        return isInCircle(item.schema)
      } if (item.schemaType === 'line') {
        return isInLine(item.schema)
      }
    })
  }

  /*
    @param x - the x coordinate
    @param y - the y coordinate
    @param buffer - the buffer is used to increase the hit box of a node beyond its radius
    @returns the node that is at the given coordinates
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

  updateAggregator.push((aggregator) => {
    if (!currHoveredNode) return aggregator
    const highestPriorityNodeScore = aggregator.reduce((acc, item) => {
      if (item.graphType !== 'node') return acc
      return item.priority > acc ? item.priority : acc
    }, -Infinity)
    const { id: hoveredNodeId } = currHoveredNode
    const hoveredNodeSchema = aggregator.find((item) => item.id === hoveredNodeId)
    if (!hoveredNodeSchema) return aggregator
    hoveredNodeSchema.priority = highestPriorityNodeScore + 0.1
    return aggregator
  })

  return {
    nodes,
    edges,
    addNode,
    moveNode,
    getNode,
    getNodeByCoordinates,
    getDrawItemsByCoordinates,
    removeNode,
    addEdge,
    removeEdge,
    getFocusedNode: () => focusedNodeId.value ? getNode(focusedNodeId.value) : undefined,
    getFocusedNodeId: () => focusedNodeId.value,
    setFocusedNode,
    eventBus,
    subscribe,
    options,
    updateAggregator,
    aggregator,
  }
}