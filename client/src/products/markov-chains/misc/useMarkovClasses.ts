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

/**
 * reactive recurrent and transient classes of a markov chain
 */
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
    /**
     * an array of sets where each set contains the node/state ids of a transient class
     */
    transientClasses,
    /**
     * an array of sets where each set contains the node/state ids of a recurrent class
     */
    recurrentClasses,
  };
}

export type MarkovClasses = ReturnType<typeof useMarkovClasses>