import { getStronglyConnectedComponents } from "./tarjansSCC";
import type { Graph } from "@/useGraph/useGraph"
import { nodesEdgesToAdjList, type AdjacencyList } from '@/graphConverters';
import { TAILWIND_500_COLORS as color } from "./colors";
import { computed } from "vue";

const defaultColors = [
  color.RED,
  color.YELLOW,
  color.GREEN,
  color.BLUE,
  color.INDIGO,
  color.PURPLE,
  color.PINK,
]

type Color = string;

// tailwind gray 900
const TRANSIENT_COLOR = '#030712'

export const markovSccColorizer = (
  graph: Graph,
  colors: Color[] = defaultColors
) => {
  const adjList = computed(() => nodesEdgesToAdjList(graph.nodes.value, graph.edges.value));
  const adjMap = computed(() => adjListToAdjMap(adjList.value));
  const components = computed(() => getStronglyConnectedComponents(adjList.value));

  graph.theme.value.nodeBorderColor = (node) => {
    const sccIndex = components.value.findIndex(scc => scc.includes(Number(node.label)));
    if (sccIndex === -1) {

      console.log('node not found in scc', node.label);
      return TRANSIENT_COLOR;
    };
    const nodesComponent = components.value[sccIndex];
    if (nodesComponent.length === 1) return TRANSIENT_COLOR;
    return colors[sccIndex % colors.length];
  }
}