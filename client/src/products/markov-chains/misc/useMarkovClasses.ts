import { computed } from "vue"
import type { Ref } from "vue"
import type { GNode, Graph } from "@graph/types"
import type { ComponentAdjacencyMap } from "./useComponentAdjacencyMap"

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
  const { stronglyConnectedComponents: sccs } = graph.characteristics;

  const transientClasses = computed(() => {
    const { transient } = getMarkovClasses(sccs.value, componentMap.value)
    return transient;
  });

  const recurrentClasses = computed(() => {
    const { recurrent } = getMarkovClasses(sccs.value, componentMap.value)
    return recurrent;
  });

  return {
    transientClasses,
    recurrentClasses,
  };
}