import { readonly } from "vue";
import type { Graph } from "@graph/types";
import { sourceNode, sinkNode } from "./useSourceSinkControls";
import { useFordFulkerson } from "./useFordFulkerson";

/**
 * properties of a network flow graph including the max flow value
 * and other statistics (coming soon)
 */
export const useFlowProperties = (graph: Graph) => {

  const { maxFlow } = useFordFulkerson(graph, {
    source: sourceNode,
    sink: sinkNode,
  });

  return {
    maxFlow: readonly(maxFlow),
  }
};

export type FlowProperties = ReturnType<typeof useFlowProperties>;