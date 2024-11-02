
/**
 * make every key in an object optional including nested objects
 */
export type DeepPartial<T> = {
  [K in keyof T]?: K extends Record<any, any>
  ? DeepPartial<T[K]>
  : T[K];
};

/**
 * make every key in an object required including nested objects
 */
export type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends Record<any, any>
  ? DeepRequired<T[K]>
  : T[K];
};

/**
 * helper types for nested keys
 */
type AcceptableKeys = string | number | symbol
type AcceptableObject = Record<AcceptableKeys, any>

/**
 * get a clean union of all paths in an object
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

export type DeepValue<T, Path extends string> = ExecuteDeepValue<OnlyObjNested<T>, Path>