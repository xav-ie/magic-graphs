import { computed, ref, watch } from "vue";
import type { Graph } from "@graph/types";
import { dijkstras } from "./dijkstra";
import type { DijkstrasTrace } from "./dijkstra";
import state from "../state";

export const useDijkstra = (graph: Graph) => {
  const trace = ref<DijkstrasTrace>([]);
  const { startNode } = state;

  const update = () => {
    if (!startNode.value) return
    const validStartNode = graph.getNode(startNode.value.id)
    if (!validStartNode) return
    trace.value = dijkstras(graph, startNode.value.id)
  }

  graph.subscribe("onStructureChange", update);
  graph.subscribe("onEdgeLabelChange", update);
  graph.subscribe("onGraphReset", update);

  watch(startNode, update, { immediate: true });

  return {
    output: {},
    trace: computed(() => trace.value),
  }
};
