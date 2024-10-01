import type { Node as GNode } from './useGraph';

const defaultColorPalette = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];

export const bfsNodeColorizer = (colors = defaultColorPalette) => {
  return (node: GNode) => {
    return colors[node.id % colors.length];
  }
}