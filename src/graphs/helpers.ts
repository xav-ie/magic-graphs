import type { Ref } from 'vue'
import type {
  FullThemeMap,
  GraphTheme,
  GraphThemeKey
} from '@graph/themes/types'
import type {
  BaseGraphEdgeTheme,
  BaseGraphNodeTheme,
} from '@graph/themes'
import type {
  MaybeGetter,
  SchemaItem,
  GNode,
  GEdge,
  MappingsToEventBus,
  UnwrapMaybeGetter,
  Graph
} from '@graph/types'
import type { BaseGraphEvents, BaseGraphSettings } from '@graph/compositions/useBaseGraph'
import type { DeepRequired, DeepValue, NestedKeys } from '@utils/types'
import type { PersistentGraphSettings } from './compositions/usePersistentGraph'

/**
  unwraps MaybeGetter type into a value of type T.
  @returns UnwrapMaybeGetter<MaybeGetter<T, K>> <-> T
*/
export const getValue = <T, K extends any[]>(value: MaybeGetter<T, K>, ...args: K) => {
  if (typeof value === 'function') {
    return (value as (...args: K) => T)(...args)
  }
  return value
}

/**
 * slightly modified extract utility useful for replacing the never type with R.
 */
type ModifiedExtract<T, U, R = never> = T extends U ? T : R

/**
 * implements ModifiedExtract with a noop function as the replacement type.
 */
type FuncExtract<T, U> = ModifiedExtract<T, U, () => void>

/**
 * extracts the parameters out of a graph theme properties getter function
 */
type ThemeParams<T extends GraphThemeKey> = Parameters<FuncExtract<GraphTheme[T], Function>>

/**
 * if the theme properties getter has no parameters
 * return an empty array, otherwise return the parameters
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
    const themeMapEntry = themeMap[prop].findLast((themeMapEntryItem: FullThemeMap[T][number]) => {
      const themeGetterOrValue = themeMapEntryItem.value
      const themeValue = getValue<typeof themeGetterOrValue, K>(
        themeGetterOrValue,
        ...args
      ) as UnwrapMaybeGetter<GraphTheme[T]>
      return themeValue ?? false
    })
    const getter = themeMapEntry?.value ?? theme.value[prop]
    if (!getter) throw new Error(`Theme property "${prop}" not found`)
    return getValue<typeof getter, K>(getter, ...args) as UnwrapMaybeGetter<GraphTheme[T]>
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
    eventBus[event] = eventBus[event].filter((f: T[K]) => f !== fn)
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
 * asks if any given edge flows out to any given node
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

export const setting = <S extends {}, P extends NestedKeys<S>>(settings: S, path: P) => {
  return path
    // @ts-ignore this works because P is always a string in settings
    .split('.')
    // @ts-ignore the nested key type does the checking for the acc[key] indexing
    .reduce((acc, key) => {
      if (acc === undefined) return acc
      return acc[key]
      // @ts-ignore
    }, settings) as DeepValue<DeepRequired<S>, P>
}

/**
 * gets the theme attributes for a GNode at the point in time the function is called
 *
 * @param getTheme - the theme getter function
 * @param node - the node to get the theme for
 * @returns the theme attributes for the node
 */
export const resolveThemeForNode = (getTheme: ThemeGetter, node: GNode): BaseGraphNodeTheme => ({
  nodeSize: getTheme('nodeSize', node),
  nodeBorderWidth: getTheme('nodeBorderWidth', node),
  nodeColor: getTheme('nodeColor', node),
  nodeBorderColor: getTheme('nodeBorderColor', node),
  nodeFocusColor: getTheme('nodeFocusColor', node),
  nodeFocusBorderColor: getTheme('nodeFocusBorderColor', node),
  nodeTextSize: getTheme('nodeTextSize', node),
  nodeTextColor: getTheme('nodeTextColor', node),
  nodeFocusTextColor: getTheme('nodeFocusTextColor', node),
  nodeText: getTheme('nodeText', node),
  nodeShape: getTheme('nodeShape', node),
})

/**
 * gets the theme attributes for a GEdge at the point in time the function is called
 *
 * @param getTheme - the theme getter function
 * @param edge - the edge to get the theme for
 * @returns the theme attributes for the edge
 */
export const resolveThemeForEdge = (getTheme: ThemeGetter, edge: GEdge): BaseGraphEdgeTheme => ({
  edgeWidth: getTheme('edgeWidth', edge),
  edgeColor: getTheme('edgeColor', edge),
  edgeTextSize: getTheme('edgeTextSize', edge),
  edgeTextColor: getTheme('edgeTextColor', edge),
  edgeFocusColor: getTheme('edgeFocusColor', edge),
  edgeFocusTextColor: getTheme('edgeFocusTextColor', edge),
  edgeTextFontWeight: getTheme('edgeTextFontWeight', edge),
})