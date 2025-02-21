/**
 * reduce an array of sets into a single set
 *
 * @param sets array of sets
 * @returns a single set containing all elements from the input sets
 * @example reduceSet([new Set([1, 2]), new Set([2, 3])]) // Set(1, 2, 3)
 */
export const reduceSet = <T>(sets: Set<T>[]) => {
  return sets.reduce((acc, set) => new Set([...acc, ...set]), new Set<T>());
};
