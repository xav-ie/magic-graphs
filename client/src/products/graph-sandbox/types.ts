
/**
 * the theme id of the markup menu
 */
export const MARKUP_USETHEME_ID = "markup";

/**
 * size options for nodes and edges in the markup menu
 */
export const MARKUP_SIZES = ["XS", "SM", "MD", "LG", "XL"] as const;

/**
 * a union of all possible sizes for nodes and edges in the markup menu
 */
export type MarkupSize = typeof MARKUP_SIZES[number];

/**
 * maps a size to a radius of a circle (for nodes)
 */
export const SIZE_TO_RADIUS = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20
} as const;

/**
 * maps a size to a width of a line (for edges)
 */
export const SIZE_TO_WIDTH = {
  XS: 1,
  SM: 2,
  MD: 3,
  LG: 4,
  XL: 5
} as const;