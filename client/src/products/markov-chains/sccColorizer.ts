import { computed } from "vue";
import { getAdjacencyList } from '@graph/useAdjacencyList';
import {
  TAILWIND_500_COLORS as color,
  GRAY_800,
  type Color
} from "@colors";
import { TRANSIENT_COLOR } from "./colors";
import { useMarkovChainSCC } from "./useSCC";
import type { GNode, Graph } from "@graph/types";

const defaultColors = [
  color.RED,
  color.YELLOW,
  color.GREEN,
  color.BLUE,
  color.INDIGO,
  color.PURPLE,
  color.PINK,
];

export const markovSccColorizer = (
  graph: Graph,
  colors: Color[] = defaultColors
) => {

  const adjList = computed(() => getAdjacencyList(graph));

  const { markovClasses, nodeToConnectedComponentMap } = useMarkovChainSCC(adjList);
  const transientStates = computed(() => markovClasses.value.transientClasses.flat());

  const getColor = (node: GNode) => {
    const label = Number(node.label);
    if (transientStates.value.includes(label)) return TRANSIENT_COLOR;
    const componentIndex = nodeToConnectedComponentMap.value.get(label);
    if (componentIndex === undefined) return TRANSIENT_COLOR;
    return colors[componentIndex % colors.length];
  }

  graph.theme.value.nodeBorderColor = getColor;
  graph.theme.value.nodeAnchorColor = getColor;
  graph.theme.value.nodeAnchorColorWhenParentFocused = getColor;
  graph.theme.value.nodeFocusBorderColor = getColor;
  graph.theme.value.nodeFocusColor = GRAY_800;
}