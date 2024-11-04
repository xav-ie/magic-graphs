
/**
 * makes the first letter of a string uppercase
 *
 * @param str - the string to capitalize
 * @returns the capitalized string
 */
export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);