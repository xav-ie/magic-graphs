import {
  ref,
  watch,
  onUnmounted,
} from 'vue';
import type { GNode, Graph } from '@graph/types';
import { getValue } from '@graph/helpers';
import { useTheme } from '@graph/themes/useTheme';
import colors from '@colors';
import { SEARCH_VISUALIZER_THEME_ID } from './types';
import { useBFSLevels } from './useBFSLevels';

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

export const useBFSColorizer = (
  graph: Graph,
  optionArg: Partial<BFSColorizerOptions> = {}
) => {

  const defaultOptions: BFSColorizerOptions = {
    startNode: graph.nodes.value[0]?.label ?? '1',
    colorPalette: defaultColorPalette,
  }

  const options = {
    ...defaultOptions,
    ...optionArg
  }

  const isColorized = ref(false);
  const { setTheme, removeTheme } = useTheme(graph, SEARCH_VISUALIZER_THEME_ID);
  const { bfsLevelRecord, startNode } = useBFSLevels(graph, options.startNode);

  const shiftStartNodeIfNecessary = () => {
    const startNodeInGraph = graph.nodes.value.find(node => node.id === startNode.value);
    if (!startNodeInGraph) {
      const [ newStartNode ] = graph.nodes.value;
      console.log('start node removed, shifting to', newStartNode.label);
      startNode.value = newStartNode.label;
    }
  }

  const color = (node: GNode) => {
    const level = bfsLevelRecord.value[node.label];
    // disjoint from bfs tree
    if (level === undefined) return getValue(graph.theme.value.nodeBorderColor, node);
    const colors = options.colorPalette;
    return colors[level % colors.length];
  }

  const colorize = () => {
    setTheme('nodeBorderColor', color);
    setTheme('nodeAnchorColor', color);
    isColorized.value = true;
  }

  const decolorize = () => {
    removeTheme('nodeBorderColor');
    removeTheme('nodeAnchorColor');
    isColorized.value = false;
  }

  watch(isColorized, () => {
    isColorized.value ? colorize() : decolorize();
  })

  graph.subscribe('onNodeRemoved', shiftStartNodeIfNecessary);
  onUnmounted(() => graph.unsubscribe('onNodeRemoved', shiftStartNodeIfNecessary));

  return {
    isColorized,
    colorize,
    decolorize,
    toggleColorize: () => isColorized.value = !isColorized.value,
  }
}