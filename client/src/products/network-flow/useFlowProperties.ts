import { readonly, ref } from "vue";
import type { Graph } from "@graph/types";
import { SINK_LABEL, SOURCE_LABEL } from "./useFlowControls";
import { fordFulkerson } from "./fordFulkerson";
import { useResidualEdges } from "./useResidualEdges";

export const useFlowProperties = (graph: Graph) => {

  const maxFlow = ref<number | undefined>()

  const { cleanupResidualEdges, createResidualEdges } = useResidualEdges(graph)

  const recompute = async () => {
    createResidualEdges()

    const src = graph.nodes.value.find(n => n.label === SOURCE_LABEL)
    const sink = graph.nodes.value.find(n => n.label === SINK_LABEL)
    if (!src || !sink) return cleanupResidualEdges()

    const { maxFlow: res } = fordFulkerson(graph, src.id, sink.id)
    maxFlow.value = res
    cleanupResidualEdges()
  }

  graph.subscribe('onStructureChange', recompute)
  graph.subscribe('onEdgeLabelChange', recompute)

  return {
    maxFlow: readonly(maxFlow),
  }
};

export type FlowProperties = ReturnType<typeof useFlowProperties>;