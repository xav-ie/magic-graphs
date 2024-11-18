import type {
  Graph,
  GNode,
  GEdge,
  MaybeGetter,
  SchemaItem,
} from '@graph/types'

/**
 * unwraps a MaybeGetter into a value of type T.
 *
 * @param value - the value to unwrap
 * @param args - the arguments to pass to the getter if the value is a getter
 * @returns T, which is UnwrapMaybeGetter<MaybeGetter<T, K>>
 * @example getValue(5) // 5
 * getValue(() => 5) // 5
 */
export const getValue = <T, K extends any[]>(value: MaybeGetter<T, K>, ...args: K) => {
  if (typeof value === 'function') {
    return (value as (...args: K) => T)(...args)
  }
  return value
}

/**
 * generates a new, random, id
 * @example generateId() // 'abc123'
 */
export const generateId = () => Math.random().toString(36).substring(2, 9)

/**
 * modifies the priority of the items passed in
 * such that the item with the id passed in has the highest priority
 * while preserving the order of the other items and their relative priorities.
 *
 * @param id - the id of the item to prioritize
 * @param items - loose subset of the items in the aggregator
 * @returns void - the items are modified in place
 */
export const prioritize = (id: SchemaItem['id'], items: SchemaItem[]) => {
  const itemToPrioritize = items.find(item => item.id === id)
  if (!itemToPrioritize) return

  const priorities = items.map(item => item.priority)
  const [max, min] = [Math.max(...priorities), Math.min(...priorities)]
  const range = max - min
  itemToPrioritize.priority = max

  items.sort((a, b) => a.priority - b.priority)

  const increment = Number((range / items.length).toFixed(2))
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) continue
    items[i].priority = min + (increment * i)
  }
}

/**
 * a helper that, when given the aggregator, will specifically prioritize a node
 *
 * @param id - the id of the node to prioritize
 * @param items - the aggregator array
 * @returns void - the items are modified in place
 */
export const prioritizeNode = (id: SchemaItem['id'], items: SchemaItem[]) => {
  const nodeSchemas = items.filter(item => item.graphType === 'node')
  prioritize(id, nodeSchemas)
}

/**
 * @description given two numbers, this function returns a random number between them (inclusive)
 *
 * @param min - the lowest number
 * @param max - the highest number
 * @returns a random number between min and max
 */
export const getRandomInRange = (min: number, max: number) => Math.round(Math.random() * (max - min) + min);

export const getRandomPointOnCanvas = (canvas: HTMLCanvasElement, buffer = 50) => ({
  x: getRandomInRange(buffer, canvas.width - buffer),
  y: getRandomInRange(buffer, canvas.height - buffer),
});

/**
 * get the nodes that an edge links together
 *
 * @param edgeId - the id of the edge
 * @param graph - the graph instance
 * @returns an array of the nodes that the edge links together [from, to]
 * @throws an error if the edge or the nodes it links are not in the graph
 * @example getConnectedNodes('abc123', graph)
 * // [{ id: 'dla4me', x: 0, y: 0 }, { id: 'def456', x: 100, y: 100 }]
 * // because edge 'abc123' links nodes 'dla4me' and 'def456'
 */
export const getConnectedNodes = (edgeId: GEdge['id'], graph: Graph) => {
  const edge = graph.getEdge(edgeId)
  if (!edge) throw new Error('edge not found')
  const from = graph.getNode(edge.from)
  const to = graph.getNode(edge.to)
  if (!from || !to) throw new Error('nodes not found')
  return [from, to]
}

/**
 * get all edges flowing into or out of a node
 *
 * @param nodeId - the id of the node
 * @param graph - the graph instance
 * @returns an array of edges that flow into or out of the node
 * @example getConnectedEdges('abc123', graph)
 * // [{ from: 'abc123', to: 'def456' }, { from: 'ghi789', to: 'abc123' }]
 */
export const getConnectedEdges = (nodeId: GNode['id'], graph: Graph) => graph.edges.value.filter(edge => {
  const isFlowingOut = isEdgeFlowingOutOfNode(edge, nodeId, graph)
  const isFlowingIn = isEdgeFlowingIntoNode(edge, nodeId, graph)
  return isFlowingOut || isFlowingIn
})

export const getDirectedInboundEdges = (nodeId: string, edges: GEdge[]) => {
  return edges.filter(edge => isDirectedEdgeFlowingIntoNode(edge, nodeId))
}

export const getUndirectedInboundEdges = (nodeId: string, edges: GEdge[]) => {
  return edges.filter(edge => isUndirectedEdgeFlowingIntoNode(edge, nodeId))
}

/**
 * gets the edges that flow into a node
 *
 * @param nodeId - the id of the node
 * @param graph - the graph instance
 * @returns an array of edges that flow into the node
 * @example getInboundEdges('abc123', graph)
 * // [{ from: 'ghi789', to: 'abc123' }]
 */
export const getInboundEdges = (nodeId: string, graph: Graph) => {
  const fn = graph.settings.value.isGraphDirected ? getDirectedInboundEdges : getUndirectedInboundEdges
  return fn(nodeId, graph.edges.value)
}

const getDirectedOutboundEdges = (nodeId: string, edges: GEdge[]) => {
  return edges.filter(edge => isDirectedEdgeFlowingOutOfNode(edge, nodeId))
}

const getUndirectedOutboundEdges = (nodeId: string, edges: GEdge[]) => {
  return edges.filter(edge => isUndirectedEdgeFlowingOutOfNode(edge, nodeId))
}

/**
 * gets the edges that flow out of a node
 *
 * @param nodeId - the id of the node
 * @param graph - the graph instance
 * @returns an array of edges that flow out of the node
 * @example getOutboundEdges('abc123', graph)
 * // [{ from: 'abc123', to: 'def456' }]
 */
export const getOutboundEdges = (nodeId: string, graph: Graph) => {
  const fn = graph.settings.value.isGraphDirected ? getDirectedOutboundEdges : getUndirectedOutboundEdges
  return fn(nodeId, graph.edges.value)
}

const isDirectedEdgeFlowingOutOfNode = (edge: GEdge, nodeId: GNode['id']) => {
  return edge.from === nodeId
}

const isUndirectedEdgeFlowingOutOfNode = (edge: GEdge, nodeId: GNode['id']) => {
  return edge.from === nodeId || edge.to === nodeId
}

/**
 * true if the edge flows out of the node, false otherwise
 *
 * @param edge - the edge to check
 * @param nodeId - the id of the node to check
 * @param graph - the graph instance
 * @returns true if the edge flows out of the node, false otherwise
 */
export const isEdgeFlowingOutOfNode = (edge: GEdge, nodeId: GNode['id'], graph: Graph) => {
  const fn = graph.settings.value.isGraphDirected ? isDirectedEdgeFlowingOutOfNode : isUndirectedEdgeFlowingOutOfNode
  return fn(edge, nodeId)
}

const isDirectedEdgeFlowingIntoNode = (edge: GEdge, nodeId: GNode['id']) => {
  return edge.to === nodeId
}

const isUndirectedEdgeFlowingIntoNode = (edge: GEdge, nodeId: GNode['id']) => {
  return edge.from === nodeId || edge.to === nodeId
}

/**
 * true if the edge flows out of the node, false otherwise
 *
 * @param edge - the edge to check
 * @param nodeId - the id of the node to check
 * @param graph - the graph instance
 * @returns true if the edge flows out of the node, false otherwise
 */
export const isEdgeFlowingIntoNode = (edge: GEdge, nodeId: GNode['id'], graph: Graph) => {
  const fn = graph.settings.value.isGraphDirected ? isDirectedEdgeFlowingIntoNode : isUndirectedEdgeFlowingIntoNode
  return fn(edge, nodeId)
}
