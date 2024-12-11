import { computed, ref, watch } from "vue";
import type { GNode, Graph } from "@graph/types";
import { dfs } from "./dfs";
import state from "../state";
import { useAdjacencyList } from "@graph/useAdjacencyList";
import type { BasicSearchTrace } from "./types";

export const useDFS = (graph: Graph) => {
  const trace = ref<BasicSearchTrace>([]);
  const { startNode } = state;

  const { adjacencyList } = useAdjacencyList(graph);

  const update = () => {
    if (!startNode.value) return
    const validStartNode = graph.getNode(startNode.value.id)
    if (!validStartNode) return

    const rawTrace = dfs(adjacencyList.value, validStartNode.id)
    const { visited, currentNodeId } = rawTrace[rawTrace.length - 1]
    visited.add(currentNodeId ?? '')
    trace.value = [...rawTrace, { visited }]
  }

  watch([startNode, adjacencyList], update, { immediate: true });

  return {
    trace: computed(() => trace.value),
  }
};
