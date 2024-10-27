import { ref, toRef } from 'vue';
import { nodesEdgesToAdjList } from '@graph/converters';
import type { GNode, GEdge, Graph } from '@graph/types';
import { useTheme } from '@graph/themes/useTheme';
import colors from '@colors';
import { SEARCH_VISUALIZER_THEME_ID } from './types';

const defaultColorPalette = [
  colors.RED_600,
  colors.ORANGE_600,
  colors.YELLOW_600,
  colors.GREEN_600,
  colors.TEAL_600,
  colors.BLUE_600,
  colors.INDIGO_600,
  colors.PURPLE_600,
];

type BFSColorizerOptions = {
  startNode: GNode['label'],
  colorPalette: string[],
}

export const bfsNodeColorizer = (
  graph: Graph,
  optionArg: Partial<BFSColorizerOptions> = {}
) => {

  const isColorized = ref(false);

  const {
    setTheme,
    removeTheme,
    removeAllThemes
  } = useTheme(graph, SEARCH_VISUALIZER_THEME_ID);

  const defaultOptions: BFSColorizerOptions = {
    startNode: graph.nodes.value[0]?.id ?? 1,
    colorPalette: defaultColorPalette,
  }

  const options = toRef({
    ...defaultOptions,
    ...optionArg
  });



  graph.subscribe('onStructureChange', computeBfsLevels);
  graph.subscribe('onNodeRemoved', (node) => {
    if (options.value.startNode === node.id && graph.nodes.value.length > 0) {
      setStartNode(graph.nodes.value[0].id);
    }
  });

  const colorize = () => {
    graph.options.value.nodeBorderColor = (node) => {
      isColorized = true;
      const level = bfsLevelRecord[node.label];
      // not in bfs tree
      if (level === undefined) {
        return getValue(preserveGraphOptionsState.nodeBorderColor, node);
      }
      const colors = options.value.colorPalette;
      return colors[level % colors.length];
    };
  }

  const decolorize = () => {
    isColorized = false;
    graph.options.value.nodeBorderColor = preserveGraphOptionsState.nodeBorderColor;
  }

  const setStartNode = (nodeId: GNode['id']) => {
    options.value.startNode = nodeId;
    computeBfsLevels(graph.nodes.value, graph.edges.value);
  }

  const setColorPalette = (colorPalette: string[]) => {
    options.value.colorPalette = colorPalette;
  }

  return {
    colorize,
    decolorize,
    toggleColorize: () => isColorized ? decolorize() : colorize(),
    isColorized: () => isColorized,
    setStartNode,
    setColorPalette,
  }
}