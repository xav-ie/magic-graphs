import { computed, ref, watch } from "vue";
import type { GNode, Graph } from "@graph/types";
import { dijkstras } from "./dijkstra";
import state from "../state";
import { useTransitionMatrix } from "@graph/useTransitionMatrix";

export type DijkstrasOutput = {
  startNode: GNode;
  distances: Record<GNode['id'], number>;
}

export type DijkstrasTrace = {
  currentNode?: GNode;
  distances: Record<GNode['id'], number>;
  queue: Set<GNode['id']>;
}[]

export const useDijkstra = (graph: Graph) => {
  const trace = ref<DijkstrasTrace>([]);
  const output = ref<DijkstrasOutput>();
  const { startNode } = state;

  const { transitionMatrix } = useTransitionMatrix(graph);

  const update = () => {
    if (!startNode.value) return
    const startNodeIndex = graph.nodes.value.findIndex(node => node.id === startNode.value!.id)
    if (startNodeIndex === -1) return

    const res = dijkstras(transitionMatrix.value, startNodeIndex)

    // parses out the matrix trace into a more consumable format
    // by mapping the indices back to the actual nodes and node ids
    // it also optimizes the trace for quick lookups

    trace.value = res.trace.map(({ currentNode, distances, queue }) => ({
      currentNode: graph.nodes.value[currentNode ?? -1] ?? undefined,
      distances: Object.fromEntries(
        distances.map((distance, i) => [graph.nodes.value[i].id, distance])
      ),
      queue: new Set(queue.map(i => graph.nodes.value[i.node].id))
    }))

    output.value = {
      startNode: startNode.value,
      distances: Object.fromEntries(
        res.res.map((distance, i) => [graph.nodes.value[i].id, distance])
      )
    }
  }

  watch([startNode, transitionMatrix], update, { immediate: true });

  return {
    output,
    trace: computed(() => trace.value),
  }
};
