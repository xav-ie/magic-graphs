import { computed } from "vue";
import type { BaseGraph } from "@graph/base";
import { useConnected } from "./useConnected";
import type { AdjacencyLists } from "@graph/useAdjacencyList";
import { getStronglyConnectedComponents } from "./getConnectedComponents";
import type { GNode } from "@graph/types";

export const useCharacteristics = (graph: BaseGraph & {
  adjacencyLists: AdjacencyLists,
}) => {
  const connectedState = useConnected(graph.adjacencyLists);

  const bidirectionalEdges = computed(() => {
    const edges = graph.edges.value
    return edges.filter(edge => {
      return edges.some(otherEdge => {
        return edge.from === otherEdge.to && edge.to === otherEdge.from
      })
    })
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

  const hasBidirectionalEdges = computed(() => {
    return bidirectionalEdges.value.length > 0
  })

  return {
    bidirectionalEdges,
    hasBidirectionalEdges,
    stronglyConnectedComponents,
    nodeIdToStronglyConnectedComponent,
    ...connectedState,
  }
}