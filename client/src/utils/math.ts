
/**
 * the golden ratio constant.
 * {@link} https://en.wikipedia.org/wiki/Golden_ratio
 */
export const GOLDEN_RATIO = 1.618

/**
 * rounds a number to the nearest multiple of another number
 *
 * @param n the number to round
 * @param nearest the number to round to
 * @returns the rounded number
 * @example const roundToNearest5 = roundToNearestN(5);
 * roundToNearest5(13) // 15
 * roundToNearest5(12) // 10
 */
export const roundToNearestN = (nearest: number) => (n: number) => {
  return Math.round(n / nearest) * nearest;
}