import type {
  Circle,
  Line,
  Square,
  Arrow,
  UTurnArrow
} from "@shape/types"
import { useGraph } from "@graph/useGraph";

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
 *
 * @template Theme - the type of the theme
 * @template Settings - the type of the settings
 */
export type GraphOptions<Theme, Settings> = {
  theme: Partial<Theme>;
  settings: Partial<Settings>;
}

/**
 * @describes a node in a useGraph graph instance
 */
export type GNode = {
  id: string,
  label: string,
  x: number,
  y: number,
}

/**
 * @describes an edge in a useGraph graph instance
 */
export type GEdge = {
  id: string,
  to: string,
  from: string,
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
 * @describes the event bus mappings for the useGraph composable
 */
export type MappingsToEventBus<T> = Record<keyof T, any[]>

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
 * @describes a type that reverses MaybeGetter back into a value
 */
export type UnwrapMaybeGetter<T> = T extends MaybeGetter<infer U, infer _> ? U : T

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
type NodeAnchorGraphTypes = 'node-anchor' | 'link-preview'

type SharedSchemaItemFields = {
  /**
   * unique identifier for the schema item
   */
  id: string,
  /**
   * the type of graph data this schema item represents
   */
  graphType: BaseGraphTypes | NodeAnchorGraphTypes,
  /**
   * determines the order in which this schema item is rendered
   * on the canvas. The lower the number, the higher the priority, the higher the priority,
   * the earlier the item is rendered on the canvas.
   * (items with a lower priority score will appear visually underneath those with a higher score)
   */
  priority: number,
}

export type CircleSchemaItem = SharedSchemaItemFields & {
  schemaType: 'circle',
  schema: Circle,
}

export type LineSchemaItem = SharedSchemaItemFields & {
  schemaType: 'line',
  schema: Line,
}

export type SquareSchemaItem = SharedSchemaItemFields & {
  schemaType: 'square',
  schema: Square,
}

export type ArrowSchemaItem = SharedSchemaItemFields & {
  schemaType: 'arrow',
  schema: Arrow,
}

export type ArrowUTurnSchemaItem = SharedSchemaItemFields & {
  schemaType: 'uturn',
  schema: UTurnArrow
}

/**
 * @describes a schema item that can be fed into the aggregator in order to be rendered on the canvas
 */
export type SchemaItem = CircleSchemaItem | LineSchemaItem | SquareSchemaItem | ArrowSchemaItem | ArrowUTurnSchemaItem