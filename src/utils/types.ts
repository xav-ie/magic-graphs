
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
        T[K] extends AcceptableObject
        ? K extends string
        ? `${K}.${NestedKeys<T[K]>}` : never : never
    )
}[keyof T] : never