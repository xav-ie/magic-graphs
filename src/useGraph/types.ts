import type {
  Circle,
  Line,
  Square,
  Arrow,
  UTurnArrow
} from "@/shapes/types"

/**
 * describes the options for the useGraph composable
 *
 * @template Theme - the type of the theme
 * @template Settings - the type of the settings
 */
export type GraphOptions<Theme, Settings> = {
  theme: Partial<Theme>;
  settings: Partial<Settings>;
}

export type GNode = {
  id: string,
  label: string,
  x: number,
  y: number,
}

export type GEdge = {
  id: string,
  to: string,
  from: string,
  weight: number,
  type: 'directed' | 'undirected',
}

/**
 * describes the array in which schema items are added into in order to be rendered on the canvas
 *
 */
export type Aggregator = SchemaItem[]

/**
 * describes a function that takes an aggregator and returns an aggregator with alterations to
 * the internal contents, these functions are layered on top of each other to create a pipeline
 * which will be invoked with a reducer each render cycle
 */
export type UpdateAggregator = (aggregator: Aggregator) => Aggregator

/**
 * describes the event bus mappings for the useGraph composable
 */
export type MappingsToEventBus<T> = Record<keyof T, any[]>

/**
  @template T - the type of the value
  @template K - the type of the arguments
*/
export type MaybeGetter<T, K extends any[] = []> = T | ((...arg: K) => T)

export type NodeGetterOrValue<T> = MaybeGetter<T, [GNode]>
export type EdgeGetterOrValue<T> = MaybeGetter<T, [GEdge]>

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

type SharedSchemaItemFields = {
  id: string,
  graphType: string,
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

export type SchemaItem = CircleSchemaItem | LineSchemaItem | SquareSchemaItem | ArrowSchemaItem | ArrowUTurnSchemaItem