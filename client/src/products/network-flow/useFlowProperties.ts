import { readonly, type Ref } from "vue";
import type { GNode, Graph } from "@graph/types";
import { useFordFulkerson } from "./useFordFulkerson";

/**
 * properties of a network flow graph including the max flow value
 * and other statistics (coming soon)
 */
export const useFlowProperties = (graph: Graph, { source, sink }: {
  source: Ref<GNode | undefined>,
  sink: Ref<GNode | undefined>
}) => {

  const { maxFlow } = useFordFulkerson(graph, { source, sink });

  return {
    maxFlow: readonly(maxFlow),
  }
};

export type FlowProperties = ReturnType<typeof useFlowProperties>;