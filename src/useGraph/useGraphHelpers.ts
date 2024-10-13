import type { MaybeGetter, SchemaItem, GNode, GEdge } from './types'
import type { UseGraphEventBusCallbackMappings, MappingsToEventBus } from './useGraphBase'

/*
  unwraps MaybeGetter type into a value of type T
*/
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
export const generateSubscriber = <T extends UseGraphEventBusCallbackMappings>(
  eventBus: MappingsToEventBus<T>
) => <K extends keyof T>(
  event: K,
  fn: T[K]
) => eventBus[event].push(fn)

/*
  generates id. Every item on the canvas must have an id
*/
export const generateId = () => Math.random().toString(36).substring(2, 9)

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

export const prioritizeNode = (id: SchemaItem['id'], items: SchemaItem[]) => {
  const nodeSchemas = items.filter(item => item.graphType === 'node')
  prioritize(id, nodeSchemas)
}

export const getRandomBetweenRange = (min: number, max: number) => Math.round(Math.random() * (max - min) + min);
export const getRandomPointOnCanvas = (canvas: HTMLCanvasElement) => ({
  x: getRandomBetweenRange(50, canvas.width - 50),
  y: getRandomBetweenRange(50, canvas.height - 50),
});

export const getFromToNodes = (edge: GEdge, nodes: GNode[]) => {
  // using label when its ID that should be used but if i use ID, we create a new property that
  // predefined nodes and edges outside of the graph instance do not know about!
  
  const from = nodes.find(node => node.label === edge.from)
  const to = nodes.find(node => node.label === edge.to)
  if (!from || !to) throw new Error('Error')

  return { from, to }
}