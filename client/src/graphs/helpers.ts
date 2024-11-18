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
 * @description a helper that, when given the aggregator, will specifically prioritize a node
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
 * get the nodes that an edge connects
 *
 * @param edge - the edge to get the nodes from
 * @param nodes - the nodes of the graph
 * @returns an object with the from and to nodes
 * @throws an error if the nodes are not found
 */
export const getConnectedNodes = (edge: GEdge, graph: Pick<Graph, 'getNode'>) => {
  const from = graph.getNode(edge.from)
  const to = graph.getNode(edge.to)
  if (!from || !to) throw new Error('nodes not found')
  return {
    from,
    to
  }
}

/**
 * get all edges connected to a node regardless of direction
 *
 * @param node - the node to get the connected edges for
 * @param edges - the edges of the graph
 * @returns an array of edges connected to the node
 */
export const getConnectedEdges = (node: GNode, edges: GEdge[]) => edges.filter(edge => {
  return edge.from === node.id || edge.to === node.id
})

/**
 * gets the edges that flow out of a node
 *
 * @param nodeId - the id of the node
 * @param graph - the graph instance
 * @returns an array of edges that flow out of the node
 */
export const getInboundEdges = (nodeId: string, { nodes, edges }: Pick<Graph, 'nodes' | 'edges'>) => {
  return edges.value.filter(edge => {
    if (edge.type === 'undirected') {
      return edge.from === nodeId || edge.to === nodeId
    } else {
      return edge.to === nodeId
    }
  })
}

/**
 * gets the edges that flow out of a node
 *
 * @param nodeId - the id of the node
 * @param graph - the graph instance
 * @returns an array of edges that flow out of the node
 */
export const getOutboundEdges = (nodeId: string, { nodes, edges }: Pick<Graph, 'nodes' | 'edges'>) => {
  return edges.value.filter(edge => {
    if (edge.type === 'undirected') {
      return edge.from === nodeId || edge.to === nodeId
    } else {
      return edge.from === nodeId
    }
  })
}

/**
 * asks if a given edge flows out to a given node
 *
 * @param edge - the edge to check
 * @param node - the node to check
 * @returns true if the edge flows out to the node, false otherwise
 */
export const doesEdgeFlowOutOfToNode = (edge: GEdge, node: GNode) => {
  if (edge.type === 'undirected') {
    return edge.from === node.id || edge.to === node.id
  } else {
    return edge.from === node.id
  }
}
