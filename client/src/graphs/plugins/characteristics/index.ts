import { computed } from "vue";
import type { BaseGraph } from "@graph/base";
import type { GNode } from "@graph/types";
import type { AdjacencyLists } from "@graph/useAdjacencyList";
import { useConnected } from "./useConnected";
import { getStronglyConnectedComponents } from "./getConnectedComponents";
import { getBipartitePartition } from "./getBipartite";
import { findAllCycles } from "./getCycles";

type NodeIdToBipartiteSet = Map<GNode['id'], 0 | 1>;

export const useCharacteristics = (graph: BaseGraph & AdjacencyLists) => {
  const { adjacencyList, undirectedAdjacencyList } = graph;
  const connectedState = useConnected({ adjacencyList, undirectedAdjacencyList });

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
    return getBipartitePartition(adjacencyList.value)
  })

  const nodeIdToBipartitePartition = computed(() => {
    const partition = bipartitePartition.value
    const map: NodeIdToBipartiteSet = new Map()
    if (!partition) return map
    const [left, right] = partition
    for (const nodeId of left) map.set(nodeId, 0)
    for (const nodeId of right) map.set(nodeId, 1)
    return map
  })

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

  const isBipartite = computed(() => !!bipartitePartition.value)

  return {
    bidirectionalEdges,
    hasBidirectionalEdges,
    stronglyConnectedComponents,
    nodeIdToStronglyConnectedComponent,
    bipartitePartition,
    nodeIdToBipartitePartition,
    isBipartite,
    cycles,
    nodeIdToCycle,
    isAcyclic,
    isComplete,
    ...connectedState,
  }
}