import { computed } from "vue";
import type { BaseGraph } from "@graph/base";
import type { GNode } from "@graph/types";
import type { AdjacencyLists } from "@graph/useAdjacencyList";
import { useConnected } from "./useConnected";
import { useStronglyConnectedComponents } from "./scc";
import { useBipartite } from "./bipartite";
import { findAllCycles } from "./getCycles";
import { useBidirectionalEdges } from "./bidirectional";

export const useCharacteristics = (graph: BaseGraph & AdjacencyLists) => {
  const connected = useConnected(graph);
  const bidirectionalEdges = useBidirectionalEdges(graph);
  const sccs = useStronglyConnectedComponents(graph);
  const bipartite = useBipartite(graph.adjacencyList);

  const cycles = computed(() => {
    const isDirected = graph.settings.value.isGraphDirected
    if (!isDirected) {
      const res = findAllCycles(graph.adjacencyList.value)
      return res.sort((a, b) => a.length - b.length)
    }
    return sccs.stronglyConnectedComponents.value
      .filter(scc => scc.length > 1)
      .map(scc => scc.map(node => node.id))
  })

  const nodeIdToCycle = computed(() => {
    return cycles.value.reduce((acc, cycle, i) => {
      for (const nodeId of cycle) acc.set(nodeId, i);
      return acc;
    }, new Map<GNode['id'], number>());
  })

  const isAcyclic = computed(() => {
    return cycles.value.length === 0
  });

  const isComplete = computed(() => {
    const isDirected = graph.settings.value.isGraphDirected
    const n = graph.nodes.value.length
    const m = graph.edges.value.length
    return m === (isDirected ? (n * (n - 1)) : (n * (n - 1) / 2))
  });

  return {
    cycles,
    nodeIdToCycle,
    isAcyclic,
    isComplete,
    ...sccs,
    ...bidirectionalEdges,
    ...bipartite,
    ...connected,
  }
}