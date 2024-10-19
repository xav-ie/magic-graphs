import type { MaybeGetter, SchemaItem, GNode, GEdge, MappingsToEventBus } from './types'
import type { BaseGraphEvents } from './useGraphBase'

/**
  unwraps MaybeGetter type into a value of type T
*/
export const getValue = <T, K extends any[]>(value: MaybeGetter<T, K>, ...args: K) => {
  if (typeof value === 'function') {
    return (value as (...args: K) => T)(...args)
  }
  return value
}

/**
  generates a "subscribe" and "unsubscribe" function for the event bus
  in order to registering and deregistering graph events
*/
export const generateSubscriber = <T extends BaseGraphEvents>(eventBus: MappingsToEventBus<T>) => ({
  subscribe: <K extends keyof T>(event: K, fn: T[K]) => eventBus[event].push(fn),
  unsubscribe: <K extends keyof T>(event: K, fn: T[K]) => eventBus[event] = eventBus[event].filter((f) => f !== fn)
})

/**
  generates an id. Every item on the canvas must have a unique id
*/
export const generateId = () => Math.random().toString(36).substring(2, 9)

/**
 * @description modifies the priority of the items passed in
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
  const increment = Number((range / items.length).toFixed(2))
  itemToPrioritize.priority = max
  items.sort((a, b) => a.priority - b.priority)
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

export const getRandomBetweenRange = (min: number, max: number) => Math.round(Math.random() * (max - min) + min);
export const getRandomPointOnCanvas = (canvas: HTMLCanvasElement) => ({
  x: getRandomBetweenRange(50, canvas.width - 50),
  y: getRandomBetweenRange(50, canvas.height - 50),
});

/**
 * @description given an edge and a set of nodes, this function returns the nodes that the edge connects
 *
 * @param edge - the edge to get the nodes from
 * @param nodes - the nodes to search for the edge's nodes
 * @returns an object with the from and to nodes
 * @throws an error if the nodes are not found
 */
export const getFromToNodes = (edge: GEdge, nodes: GNode[]) => {
  // using label when its ID that should be used but if i use ID, we create a new property that
  // predefined nodes and edges outside of the graph instance do not know about!

  const from = nodes.find(node => node.label === edge.from)
  const to = nodes.find(node => node.label === edge.to)
  if (!from || !to) throw new Error('Error')

  return { from, to }
}