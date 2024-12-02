
/**
 * make every key in an object optional including nested objects
 * @example DeepPartial<{ a: number, b: { c: string } }> // { a?: number, b?: { c?: string } }
 */
export type DeepPartial<T> = {
  [K in keyof T]?: K extends Record<any, any>
  ? DeepPartial<T[K]>
  : T[K];
};

/**
 * make every key in an object required including nested objects
 * @example DeepRequired<{ a?: number, b?: { c?: string } }> // { a: number, b: { c: string } }
 */
export type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends Record<any, any>
  ? DeepRequired<T[K]>
  : T[K];
};

/**
 * makes only certain keys K in an object T optional
 * @example PartiallyPartial<{ a: number, b: string }, 'a'> // { a?: number, b: string }
 */
export type PartiallyPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * helper types for nested keys
 */
type AcceptableKeys = string | number | symbol
type AcceptableObject = Record<AcceptableKeys, any>

/**
 * get a clean union of all paths in an object
 * @example NestedKeys<{ a: { b: { c: 5 } } }> // 'a' | 'a.b' | 'a.b.c'
 */
export type NestedKeys<T extends AcceptableObject> = T extends AcceptableObject ? {
  [K in keyof T]: K | (
    Extract<T[K], AcceptableObject> extends AcceptableObject
    ? K extends string
    // @ts-ignore this works
    ? `${K}.${NestedKeys<Required<T[K]>>}` : never : never
  )
}[keyof T] : never

type OnlyObj<T> = Extract<T, object>

type OnlyObjNested<T> = {
  [K in keyof T]: OnlyObj<T[K]> extends never ? T[K] : OnlyObj<T[K]>
}

type ExecuteDeepValue<T, Path extends string> =
  Path extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
  ? ExecuteDeepValue<T[Key], Rest>
  : never
  : Path extends keyof T
  ? T[Path]
  : never;

/**
 * get the value of a nested key in an object
 * @example DeepValue<{ a: { b: { c: 5 } } }, 'a.b.c'> // 5
 */
export type DeepValue<T, Path extends string> = ExecuteDeepValue<OnlyObjNested<T>, Path>

/**
 * takes `any[]` out of a union of arrays
 * @example RemoveAnyArray<number[] | any[]> // number[]
 */
export type RemoveAnyArray<T extends any[]> = T extends ['!!!-@-NOT-A-TYPE-@-!!!'][] ? never : T


// HTML mouse and keyboard event types

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