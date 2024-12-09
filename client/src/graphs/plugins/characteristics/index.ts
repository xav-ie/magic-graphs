import { computed } from "vue";
import type { BaseGraph } from "@graph/base";
import { useConnected } from "./useConnected";
import type { AdjacencyLists } from "@graph/useAdjacencyList";
import { getStronglyConnectedComponents } from "./getConnectedComponents";
import type { GNode } from "@graph/types";
import { getBipartitePartition } from "./getBipartite";

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

  const bipartitePartition = computed(() => {
    const adjList = graph.adjacencyLists.adjacencyList.value
    return getBipartitePartition(adjList)
  })

  const nodeIdToBipartitePartition = computed(() => {
    const partition = bipartitePartition.value
    const map = new Map<GNode['id'], 0 | 1>()
    if (!partition) return map
    const [left, right] = partition
    for (const nodeId of left) map.set(nodeId, 0)
    for (const nodeId of right) map.set(nodeId, 1)
    return map
  })

  const isBipartite = computed(() => !!bipartitePartition.value)

  return {
    bidirectionalEdges,
    hasBidirectionalEdges,
    stronglyConnectedComponents,
    nodeIdToStronglyConnectedComponent,
    bipartitePartition,
    nodeIdToBipartitePartition,
    isBipartite,
    ...connectedState,
  }
}

function isBipartite(adjacencyLists: { adjacencyList: import("vue").Ref<import("@graph/useAdjacencyList").AdjacencyList, import("@graph/useAdjacencyList").AdjacencyList>; labelAdjacencyList: import("vue").Ref<import("@graph/useAdjacencyList").AdjacencyList, import("@graph/useAdjacencyList").AdjacencyList>; fullNodeAdjacencyList: import("vue").Ref<import("@graph/useAdjacencyList").FullNodeAdjacencyList, import("@graph/useAdjacencyList").FullNodeAdjacencyList>; weightedAdjacencyList: import("vue").Ref<import("@graph/useAdjacencyList").WeightedAdjacencyList, import("@graph/useAdjacencyList").WeightedAdjacencyList>; directedAdjacencyList: import("vue").Ref<import("@graph/useAdjacencyList").AdjacencyList, import("@graph/useAdjacencyList").AdjacencyList>; undirectedAdjacencyList: import("vue").Ref<import("@graph/useAdjacencyList").AdjacencyList, import("@graph/useAdjacencyList").AdjacencyList>; }): any {
  throw new Error("Function not implemented.");
}
