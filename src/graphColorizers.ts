import { watch } from 'vue'
import type { Node as GNode, Graph } from './useGraph';

const defaultColorPalette = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];

export const bfsNodeColorizer = (graph: Graph, colorPalette = defaultColorPalette) => {
  const preserveGraphOptionsState = {
    nodeBorderColor: graph.options.value.nodeBorderColor,
  }

  const bfsLevelRecord: Record<number, GNode['id']> = {};

  graph.subscribe('onStructureChange', (nodes, edges) => {})

  const colorize = () => {
    graph.options.value.nodeBorderColor = ({ id }) => colorPalette[id % colorPalette.length || 0];
  }

  const decolorize = () => {
    graph.options.value.nodeBorderColor = preserveGraphOptionsState.nodeBorderColor;
  }

  return { colorize, decolorize }
}