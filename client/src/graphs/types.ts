import type { Shape } from "@shape/types"
import { useGraph } from "@graph/useGraph";
import type { GraphTheme } from "./themes/types";
import type { GraphSettings } from "./settings";

/**
 * @describes the useGraph composition function
 */
export type UseGraph = typeof useGraph

/**
 * @describes an instance of the useGraph composition function
 */
export type Graph = ReturnType<UseGraph>


/**
 * @describes the options argument for all useGraph composition functions
 */
export type GraphOptions = {
  theme: Partial<GraphTheme>;
  settings: Partial<GraphSettings>;
}

/**
 * @describes a node in a useGraph graph instance
 */
export type GNode = {
  id: string,
  /**
   * it reflects what the user sees in the UI.
   * recommended to be unique.
   */
  label: string,
  /**
   * the x position of the node on the canvas
   */
  x: number,
  /**
   * the y position of the node on the canvas
   */
  y: number,
}

/**
 * @describes an edge in a useGraph graph instance
 */
export type GEdge = {
  id: string,
  /**
   * id of the node that the edge is coming from
   */
  to: string,
  /**
   * id of the node that the edge is going to
   */
  from: string,
  /**
   * the text label that appears on the edge - NOT IMPLEMENTED
   */
  label: string,

  weight: number,
  type: 'directed' | 'undirected',
}

/**
 * @describes the array in which schema items are added into in order to be rendered on the canvas
 */
export type Aggregator = SchemaItem[]

/**
 * @describes a function that takes an aggregator and returns an aggregator with alterations to
 * the internal contents, these functions are layered on top of each other to create a pipeline
 * which will be invoked with a reducer each render cycle
 */
export type UpdateAggregator = (aggregator: Aggregator) => Aggregator

/**
 * @describes something that takes an any[] our of a union of arrays
 */
export type RemoveAnyArray<T extends any[]> = T extends ['!!!-@-NOT-A-TYPE-@-!!!'][] ? never : T

/**
 * @describes taking some data that may be a plain value or a function that returns that value
 *
  @template T - the type of the value
  @template K - the type of the arguments necessary in order to resolve the value
*/
export type MaybeGetter<T, K extends any[] = []> = T | ((...arg: K) => T)


export type NodeGetterOrValue<T> = MaybeGetter<T, [GNode]>
export type EdgeGetterOrValue<T> = MaybeGetter<T, [GEdge]>

/**
 * @describes the value of a MaybeGetter
*/
export type UnwrapMaybeGetter<T> = T extends MaybeGetter<infer U, infer _> ? U : T

/**
 * @describes the parameters of a MaybeGetter
*/
export type MaybeGetterParams<T> = RemoveAnyArray<T extends MaybeGetter<infer _, infer K> ? K : []>

type EventNames = keyof HTMLElementEventMap

type FilterEventNames<T> = {
  [K in EventNames]: HTMLElementEventMap[K] extends T ? K : never
}[EventNames]

type MouseEventNames = FilterEventNames<MouseEvent>
type KeyboardEventNames = FilterEventNames<KeyboardEvent>

type EventMap<T extends EventNames, E> = Record<T, (ev: E) => void>

export type MouseEventMap = EventMap<MouseEventNames, MouseEvent>
export type KeyboardEventMap = EventMap<KeyboardEventNames, KeyboardEvent>

export type MouseEventEntries = [keyof MouseEventMap, (ev: MouseEvent) => void][]
export type KeyboardEventEntries = [keyof KeyboardEventMap, (ev: KeyboardEvent) => void][]

type BaseGraphTypes = 'node' | 'edge'
type MarqueeGraphTypes = 'marquee-selection-box'
type NodeAnchorGraphTypes = 'node-anchor' | 'link-preview'

/**
 * @describes a schema item that can be fed into the aggregator in order to be rendered on the canvas
 */
export type SchemaItem = {
  /**
   * unique identifier for the schema item
   */
  id: string,
  /**
   * the type of graph data this schema item represents
   */
  graphType: BaseGraphTypes | NodeAnchorGraphTypes | MarqueeGraphTypes,
  /**
   * determines the order in which this schema item is rendered
   * on the canvas. The lower the number, the higher the priority, the higher the priority,
   * the earlier the item is rendered on the canvas.
   * (items with a lower priority score will appear visually underneath those with a higher score)
   */
  priority: number,
  /**
   * the magic shape instance that will be rendered on the canvas
   */
  shape: Shape,
}
