import { readonly, type Ref } from "vue";
import type { GNode, Graph } from "@graph/types";
import { useFordFulkerson } from "./useFordFulkerson";

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