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
import {
  generateSubscriber,
  generateId,
  prioritizeNode,
  getRandomPointOnCanvas
} from './useGraphHelpers';
import { drawShape } from '../shapes/draw';
import { hitboxes } from '../shapes/hitboxes';
import { getNodeSchematic, type SupportedNodeShapes } from './schematics/node';
import { getEdgeSchematic } from './schematics/edge';

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
  onGraphReset: () => void;

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
  nodeSize: NodeGetterOrValue<number>,
  nodeBorderWidth: NodeGetterOrValue<number>,
  nodeColor: NodeGetterOrValue<string>,
  nodeBorderColor: NodeGetterOrValue<string>,
  nodeFocusColor: NodeGetterOrValue<string>,
  nodeFocusBorderColor: NodeGetterOrValue<string>,
  nodeText: NodeGetterOrValue<string>,
  nodeTextSize: NodeGetterOrValue<number>,
  nodeTextColor: NodeGetterOrValue<string>,
  nodeShape: NodeGetterOrValue<SupportedNodeShapes>,
  edgeColor: EdgeGetterOrValue<string>,
  edgeWidth: EdgeGetterOrValue<number>,
}

const defaultOptions: GraphOptions = {
  nodeSize: 35,
  nodeBorderWidth: 8,
  nodeColor: 'white',
  nodeBorderColor: 'black',
  nodeFocusBorderColor: 'blue',
  nodeFocusColor: 'white',
  nodeText: ({ label }: GNode) => label,
  nodeTextSize: 24,
  nodeTextColor: 'black',
  nodeShape: 'circle',
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
    onGraphReset: [],


    /* canvas element events */
    onClick: [],
    onMouseDown: [],
    onMouseUp: [],
    onMouseMove: [],
    onDblClick: [],

    onKeydown: [],
  }

  const subscribe = generateSubscriber(eventBus)

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
    const nodeSchemaItems = nodes.value.map((node, i) => {
      const schema = getNodeSchematic(node, options.value, focusedNodeId.value)
      const isCircle = 'radius' in schema
      return {
        id: node.id,
        graphType: 'node',
        schemaType: isCircle ? 'circle' : 'square',
        schema,
        priority: (i * 10) + 1000,
      } as SchemaItem
    })
    const edgeSchemaItems = edges.value.map((edge, i) => {
      const schema = getEdgeSchematic(edge, nodes.value, edges.value, options.value)
      const isUTurn = 'upDistance' in schema
      return ({
        id: edge.id,
        graphType: 'edge',
        schemaType: isUTurn ? 'uturn' : 'arrow',
        schema,
        priority: (i * 10),
      } as const)
    }).filter(({ schema }) => schema) as SchemaItem[]
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
        }
        else if (item.schemaType === 'uturn') {
          drawUTurnArrow(item.schema)
        }
        else {
          throw new Error('Unknown schema type')
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
    const { isInCircle, isInLine, isInSquare, isInArrow, isInUTurnArrow } = hitboxes(point)
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
    @param buffer - the buffer is used to increase the hit box of a node beyond its radius
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

  const liftHoveredNodeToTop = (aggregator: SchemaItem[]) => {
    if (!currHoveredNode) return aggregator
    prioritizeNode(currHoveredNode.id, aggregator)
    return aggregator
  }

  const resetGraph = () => {
    nodes.value = []
    edges.value = []
    focusedNodeId.value = undefined
    eventBus.onGraphReset.forEach(fn => fn())
  }

  subscribe('onGraphReset', () => eventBus.onStructureChange.forEach(fn => fn(nodes.value, edges.value)))

  updateAggregator.push(liftHoveredNodeToTop)

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
    resetGraph,
  }
}