
/**
 * get a random element from an array
 *
 * @param array
 * @returns random element from given array
 */
export const getRandomElement = <T>(array: T[]) => {
  return array[Math.floor(Math.random() * array.length)]
}