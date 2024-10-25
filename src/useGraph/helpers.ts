import type { Ref } from 'vue'
import type { FullThemeMap, GraphTheme, GraphThemeKey } from './theme/types'
import type { BaseGraphEdgeTheme, BaseGraphNodeTheme, BaseGraphTheme } from './themes'
import type { MaybeGetter, SchemaItem, GNode, GEdge, MappingsToEventBus, NodeGetterOrValue, UnwrapMaybeGetter } from './types'
import type { BaseGraphEvents } from './useBaseGraph'

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
 * slightly modified extract utility useful for removing the never type from the extracts output
 */
type SpecialExtract<T, U> = T extends U ? T : () => void;

/**
 * extracts the parameters out of a graph theme properties getter function
 */
type ThemeParams<T extends GraphThemeKey> = Parameters<SpecialExtract<GraphTheme[T], Function>>

/**
 * if the theme properties getter has no parameters, return an empty array, otherwise return the parameters
 */
type ResolvedThemeParams<T extends GraphThemeKey> = ThemeParams<T> extends [] ? [] : Exclude<ThemeParams<T>, []>

export const getThemeResolver = (
  theme: Ref<Partial<GraphTheme>>,
  themeMap: FullThemeMap,
) => <
  T extends GraphThemeKey,
  K extends ResolvedThemeParams<T>
>(
  prop: T,
  ...args: K
) => {
  const entries = themeMap[prop]
  const themeValue = entries.length === 0 ? theme.value[prop] : entries[entries.length - 1].value
  if (!themeValue) throw new Error(`theme value for ${prop} not found`)
  // casting to assist with inference
  return getValue<GraphTheme[T], K>(themeValue, ...args) as UnwrapMaybeGetter<GraphTheme[T]>
}

/**
 * describes the function that gets a value from a theme inquiry
 */
export type ThemeGetter = ReturnType<typeof getThemeResolver>

/**
  generates a "subscribe" and "unsubscribe" function for the event bus
  in order to registering and deregistering graph events
*/
export const generateSubscriber = <T extends BaseGraphEvents>(eventBus: MappingsToEventBus<T>) => ({
  subscribe: <K extends keyof T>(event: K, fn: T[K]) => {
    eventBus[event].push(fn)
  },
  unsubscribe: <K extends keyof T>(event: K, fn: T[K]) => {
    eventBus[event] = eventBus[event].filter((f) => f !== fn) as T[K][]
  },
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

/**
 * @description given two numbers, this function returns a random number between them (inclusive)
 *
 * @param min - the lowest number
 * @param max - the highest number
 * @returns a random number between min and max
 */
export const getRandomInRange = (min: number, max: number) => Math.round(Math.random() * (max - min) + min);

export const getRandomPointOnCanvas = (canvas: HTMLCanvasElement) => ({
  x: getRandomInRange(50, canvas.width - 50),
  y: getRandomInRange(50, canvas.height - 50),
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
  if (!from || !to) throw new Error('Nodes not found')

  return { from, to }
}

/**
 * gets the theme attributes for a GNode at the point in time the function is called
 *
 * @param theme - the theme of the useGraph instance
 * @param node - the node to get the theme for
 * @returns the theme attributes for the node
 */
export const resolveThemeForNode = (theme: BaseGraphTheme, node: GNode): BaseGraphNodeTheme => ({
  nodeSize: getValue(theme.nodeSize, node),
  nodeBorderWidth: getValue(theme.nodeBorderWidth, node),
  nodeColor: getValue(theme.nodeColor, node),
  nodeBorderColor: getValue(theme.nodeBorderColor, node),
  nodeFocusColor: getValue(theme.nodeFocusColor, node),
  nodeFocusBorderColor: getValue(theme.nodeFocusBorderColor, node),
  nodeText: getValue(theme.nodeText, node),
  nodeFocusTextColor: getValue(theme.nodeFocusTextColor, node),
  nodeTextSize: getValue(theme.nodeTextSize, node),
  nodeTextColor: getValue(theme.nodeTextColor, node),
  nodeShape: getValue(theme.nodeShape, node),
})

/**
 * gets the theme attributes for a GEdge at the point in time the function is called
 *
 * @param theme - the theme of the useGraph instance
 * @param edge - the edge to get the theme for
 * @returns the theme attributes for the edge
 */
export const resolveThemeForEdge = (theme: BaseGraphTheme, edge: GEdge): BaseGraphEdgeTheme => ({
  edgeColor: getValue(theme.edgeColor, edge),
  edgeWidth: getValue(theme.edgeWidth, edge),
  edgeTextSize: getValue(theme.edgeTextSize, edge),
  edgeTextColor: getValue(theme.edgeTextColor, edge),
  edgeFocusTextColor: getValue(theme.edgeFocusTextColor, edge),
  edgeTextFontWeight: getValue(theme.edgeTextFontWeight, edge),
  edgeFocusColor: getValue(theme.edgeFocusColor, edge),
})