import type { MaybeRef } from "vue";
import { toRef, computed } from "vue";
import type { AdjacencyList } from "@/graphConverters";
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
  const stronglyCoupledComponents = computed(() => getStronglyConnectedComponents(graphAdjList.value));
  const nodeToConnectedComponentMap = computed(() => getNodeToConnectedComponentMap(stronglyCoupledComponents.value));
  const componentAdjMap = computed(() => getComponentAdjMap(stronglyCoupledComponents.value, graphAdjMap.value));
  const markovClasses = computed(() => getRecurrentTransientClasses(stronglyCoupledComponents.value, componentAdjMap.value));

  return {
    graphAdjList,
    graphAdjMap,
    stronglyCoupledComponents,
    nodeToConnectedComponentMap,
    componentAdjMap,
    markovClasses,
  }
}