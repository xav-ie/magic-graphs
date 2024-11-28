import { computed, ref, watch } from "vue";
import type { Ref } from "vue";
import type { GNode, Graph } from "@graph/types";
import { dijkstras } from "./dijkstra";
import type { DijkstrasTrace } from "./dijkstra";

export const useDijkstra = (graph: Graph, startingNode: Ref<GNode | undefined>) => {
  const trace = ref<DijkstrasTrace>([]);

  const update = () => {
    if (!startingNode.value) return
    trace.value = dijkstras(graph, startingNode.value.id)
  }

  graph.subscribe("onStructureChange", update);
  graph.subscribe("onEdgeLabelChange", update);
  graph.subscribe("onGraphReset", update);

  watch(startingNode, update);

  update();

  return computed(() => trace.value)
};
