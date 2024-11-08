import type { MaybeRef } from "vue";
import { toRef, computed } from "vue";
import type { AdjacencyList } from "@graph/useAdjacencyList";
import { getStronglyConnectedComponents } from "./tarjansSCC";
import {
  adjListToAdjMap,
  getComponentAdjMap,
  getNodeToConnectedComponentMap,
  getRecurrentTransientClasses
} from "./helpers";

export const useMarkovChainSCC = (adjacencyList: MaybeRef<AdjacencyList>) => {

  const graphAdjList = toRef(adjacencyList);

  const graphAdjMap = computed(() => adjListToAdjMap(graphAdjList.value));
  const connectedComponents = computed(() => getStronglyConnectedComponents(graphAdjList.value));
  const nodeToConnectedComponentMap = computed(() => getNodeToConnectedComponentMap(connectedComponents.value));
  const componentAdjMap = computed(() => getComponentAdjMap(connectedComponents.value, graphAdjMap.value));
  const markovClasses = computed(() => getRecurrentTransientClasses(connectedComponents.value, componentAdjMap.value));

  return {
    graphAdjList,
    graphAdjMap,
    stronglyCoupledComponents: connectedComponents,
    nodeToConnectedComponentMap,
    componentAdjMap,
    markovClasses,
  }
}