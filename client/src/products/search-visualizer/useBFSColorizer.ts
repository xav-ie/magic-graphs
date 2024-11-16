import {
  ref,
  watch,
  onUnmounted,
} from 'vue';
import type { GNode, Graph } from '@graph/types';
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

export const useBFSColorizer = (graph: Graph) => {

  const isColorized = ref(false);
  const { setTheme, removeTheme } = useTheme(graph, SEARCH_VISUALIZER_THEME_ID);
  const { bfsLevelRecord, startNode } = useBFSLevels(graph, graph.nodes.value[0]?.id);

  const shiftStartNodeIfNecessary = () => {
    if (startNode.value === undefined) {
      const [newStartNode] = graph.nodes.value;
      if (newStartNode) startNode.value = newStartNode.id;
    }

    const startNodeInGraph = graph.nodes.value.find(node => node.id === startNode.value);
    if (!startNodeInGraph) {
      const [newStartNode] = graph.nodes.value;
      startNode.value = newStartNode ? newStartNode.id : undefined;
    }
  }

  const color = (node: GNode) => {
    if (graph.isFocused(node.id)) return
    const level = bfsLevelRecord.value[node.id];
    // disjoint from bfs tree
    if (level === undefined) return;
    const colors = defaultColorPalette;
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
  graph.subscribe('onNodeAdded', shiftStartNodeIfNecessary);
  onUnmounted(() => {
    graph.unsubscribe('onNodeRemoved', shiftStartNodeIfNecessary);
    graph.unsubscribe('onNodeAdded', shiftStartNodeIfNecessary);
  });

  return {
    isColorized,
    colorize,
    decolorize,
    toggleColorize: () => isColorized.value = !isColorized.value,

    bfsLevelRecord,
    startNode,
  }
}