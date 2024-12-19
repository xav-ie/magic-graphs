import { computed } from "vue";
import type { BaseGraph } from "@graph/base";
import type { GNode } from "@graph/types";
import type { AdjacencyLists } from "@graph/useAdjacencyList";
import { useConnected } from "./useConnected";
import { getStronglyConnectedComponents } from "./getConnectedComponents";
import { useBipartite } from "./bipartite";
import { findAllCycles } from "./getCycles";

export const useCharacteristics = (graph: BaseGraph & AdjacencyLists) => {
  const { adjacencyList, undirectedAdjacencyList } = graph;
  const connectedState = useConnected({ adjacencyList, undirectedAdjacencyList });

  /**
   * all edges that link two nodes in both directions
   * (i.e. edge A->B and B->A are a bidirectional pair of edges)
   */
  const bidirectionalEdges = computed(() => {
    const edges = graph.edges.value
    return edges
      .filter(edge => edge.from !== edge.to)
      .filter(edge => {
        return edges.some(otherEdge => {
          return edge.from === otherEdge.to && edge.to === otherEdge.from
        })
      })
  })

  const hasBidirectionalEdges = computed(() => {
    return bidirectionalEdges.value.length > 0
  })

  const stronglyConnectedComponents = computed(() => {
    return getStronglyConnectedComponents(graph.nodes.value, graph.edges.value)
  });

  const nodeIdToStronglyConnectedComponent = computed(() => {
    const sccs = stronglyConnectedComponents.value;
    return sccs.reduce((acc, scc, i) => {
      for (const { id } of scc) acc.set(id, i);
      return acc;
    }, new Map<GNode['id'], number>());
  })

  const bipartite = useBipartite(adjacencyList);

  const cycles = computed(() => {
    const isDirected = graph.settings.value.isGraphDirected
    if (!isDirected) {
      const res = findAllCycles(adjacencyList.value)
      return res.sort((a, b) => a.length - b.length)
    }
    return stronglyConnectedComponents.value
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
    bidirectionalEdges,
    hasBidirectionalEdges,
    stronglyConnectedComponents,
    nodeIdToStronglyConnectedComponent,
    cycles,
    nodeIdToCycle,
    isAcyclic,
    isComplete,

    ...bipartite,
    ...connectedState,
  }
}