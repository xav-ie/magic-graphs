import { computed } from "vue"
import type { Ref } from "vue"
import type { ComponentAdjacencyMap } from "./useComponentAdjacencyMap"
import type { GNode, Graph } from "@graph/types"

export const getMarkovClasses = (
  connectedComponents: Graph['characteristics']['stronglyConnectedComponents']['value'],
  componentMap: ComponentAdjacencyMap
) => {
  const recurrent: Set<GNode['id']>[] = [];
  const transient: Set<GNode['id']>[] = [];

  for (const [component, reachableComponents] of componentMap) {
    const leaf = reachableComponents.size === 0;
    const classMembership = leaf ? recurrent : transient;
    classMembership.push(new Set(connectedComponents[component].map(node => node.id)))
  }

  return {
    recurrent,
    transient,
  };
}

export const useMarkovClasses = (graph: Graph, componentMap: Ref<ComponentAdjacencyMap>) => {
  return computed(() => getMarkovClasses(
    graph.characteristics.stronglyConnectedComponents.value,
    componentMap.value
  ))
}