import { computed, ref, watch } from "vue";
import type { GNode, Graph } from "@graph/types";
import { bfs, type BFSTrace } from "./bfs";
import state from "../state";
import { useAdjacencyList } from "@graph/useAdjacencyList";

export const useBFS = (graph: Graph) => {
  const trace = ref<BFSTrace>([]);
  const { startNode } = state;

  const { adjacencyList } = useAdjacencyList(graph);

  const update = () => {
    if (!startNode.value) return
    const validStartNode = graph.getNode(startNode.value.id)
    if (!validStartNode) return

    trace.value = bfs(adjacencyList.value, validStartNode.id)
  }

  watch([startNode, adjacencyList], update, { immediate: true });

  return {
    trace: computed(() => trace.value),
  }
};
