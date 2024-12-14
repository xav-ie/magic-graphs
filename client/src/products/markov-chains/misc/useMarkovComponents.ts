import { computed } from "vue";
import type { Graph } from "@graph/types";

export type ComponentMap = Map<number, Set<number>>

/**
 * get a map of connected components to the components it can reach
 *
 * @param graph graph instance
 * @returns component adjacency map
 */
export const getComponentAdjMap = (graph: Graph) => {
  const nodeToComponentMap = graph.characteristics.nodeIdToStronglyConnectedComponent.value
  const connectedComponents = graph.characteristics.stronglyConnectedComponents.value;
  const graphAdjMap = graph.adjacencyList.adjacencyList.value;

  /**
   * index of graph connected component -> indices of connected components adjacent to it
   */
  const componentAdjMap: ComponentMap = new Map();

  connectedComponents.forEach((component, componentIndex) => {
    const componentChildren = component
      .flatMap((node) => graphAdjMap[node.id] ?? [])
      .filter((nodeId) => nodeToComponentMap.get(nodeId) !== componentIndex)

    const mappedComponentChildren = componentChildren.map((node) => {
      const componentIndex = nodeToComponentMap.get(node)
      if (componentIndex === undefined) throw new Error('Component index not found')
      return componentIndex;
    });

    componentAdjMap.set(componentIndex, new Set(mappedComponentChildren));
  })

  return componentAdjMap;
}

/**
 * reactive {@link ComponentMap | component map} for markov chain components
 */
export const useMarkovComponents = (graph: Graph) => {
  return computed(() => getComponentAdjMap(graph));
}