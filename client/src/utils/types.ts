/**
 * makes only certain keys K in an object T optional
 * @example PartiallyPartial<{ a: number, b: string }, 'a'> // { a?: number, b: string }
 */
export type PartiallyPartial<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

/**
 * takes `any[]` out of a union of arrays
 * @example RemoveAnyArray<number[] | any[]> // number[]
 */
export type RemoveAnyArray<T extends any[]> = Exclude<
  T,
  ['!!!-@-NOT-A-TYPE-@-!!!'][]
>;

// HTML mouse and keyboard event types

type EventNames = keyof HTMLElementEventMap;

type FilterEventNames<T> = {
  [K in EventNames]: HTMLElementEventMap[K] extends T ? K : never;
}[EventNames];

type MouseEventNames = FilterEventNames<MouseEvent>;
type KeyboardEventNames = FilterEventNames<KeyboardEvent>;

type EventMap<T extends EventNames, E> = Record<T, (ev: E) => void>;

export type MouseEventMap = EventMap<MouseEventNames, MouseEvent>;
export type KeyboardEventMap = EventMap<KeyboardEventNames, KeyboardEvent>;

export type MouseEventEntries = [
  keyof MouseEventMap,
  (ev: MouseEvent) => void,
][];
export type KeyboardEventEntries = [
  keyof KeyboardEventMap,
  (ev: KeyboardEvent) => void,
][];
