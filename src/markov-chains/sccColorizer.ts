import type { Graph } from "@/useGraph/useGraph"
import { nodesEdgesToAdjList } from '@/graphConverters';
import {
  TAILWIND_500_COLORS as color,
  GRAY_800,
  GRAY_900,
  TRANSIENT_COLOR,
  type Color
} from "./colors";
import { computed } from "vue";
import { useMarkovChainSCC } from "./useSCC";
import type { GNode } from "@/useGraph/types";

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

  const adjList = computed(() => nodesEdgesToAdjList(graph.nodes.value, graph.edges.value));

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