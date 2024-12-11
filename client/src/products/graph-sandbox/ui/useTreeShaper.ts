import { computed } from "vue";
import type { Graph } from "@graph/types";
import { useNodeDepth } from "@product/search-visualizer/useNodeDepth";

export const useTreeShaper = (graph: Graph) => {
  const rootNode = computed(() => graph.nodes.value[0]);
  const bfsLevels = useNodeDepth(graph, rootNode);

  const shapeGraph = () => {
    console.log('Shaping graph...')
    console.log('BFS levels:', bfsLevels.value)
  }

  return {
    shapeGraph
  }
}