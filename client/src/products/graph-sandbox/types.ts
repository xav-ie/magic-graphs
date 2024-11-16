
/**
 * size options for nodes and edges in the markup menu
 */
export const MARKUP_SIZES = ["XS", "SM", "MD", "LG", "XL"] as const;

/**
 * a union of all possible sizes for nodes and edges in the markup menu
 */
export type MarkupSize = typeof MARKUP_SIZES[number];