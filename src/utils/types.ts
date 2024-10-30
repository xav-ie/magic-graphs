
export type DeepPartial<T> = {
  [K in keyof T]?: K extends Record<any, any>
  ? DeepPartial<T[K]>
  : T[K];
};

export type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends Record<any, any>
  ? DeepRequired<T[K]>
  : T[K];
};