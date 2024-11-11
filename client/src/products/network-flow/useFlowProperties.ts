import { readonly } from "vue";
import type { Graph } from "@graph/types";
import { useFordFulkerson } from "./useFordFulkerson";

export const useFlowProperties = (graph: Graph) => {

  const { maxFlow } = useFordFulkerson(graph)

  return {
    maxFlow: readonly(maxFlow),
  }
};

export type FlowProperties = ReturnType<typeof useFlowProperties>;