
export type Node = {
  id: number,
  x: number,
  y: number,
}

export type Edge = {
  to: number,
  from: number,
}

export type MaybeGetter<T, K extends any[] = []> = T | ((...arg: K) => T)
export type NodeGetterOrValue<T> = MaybeGetter<T, [Node]>
export type EdgeGetterOrValue<T> = MaybeGetter<T, [Edge]>

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