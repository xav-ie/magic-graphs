import { ref } from 'vue'
import type { Ref } from 'vue'
import { fordFulkerson } from './fordFulkerson'
import type { FlowTrace } from './fordFulkerson'
import type { GNode, Graph } from '@graph/types'
import { useResidualEdges } from './useResidualEdges'

export const useFordFulkerson = (graph: Graph, { source, sink }: {
  source: Ref<GNode | undefined>,
  sink: Ref<GNode | undefined>
}) => {
  const trace = ref<FlowTrace>([])
  const maxFlow = ref(0)

  const { createResidualEdges, cleanupResidualEdges } = useResidualEdges(graph)

  const update = () => {
    if (!source.value || !sink.value) return
    createResidualEdges()
    const { maxFlow: gotMaxFlow, trace: gotTrace } = fordFulkerson(graph, {
      sourceId: source.value.id,
      sinkId: sink.value.id,
    })
    trace.value = gotTrace
    maxFlow.value = gotMaxFlow
    cleanupResidualEdges()
  }

  graph.subscribe('onEdgeLabelChange', update)
  graph.subscribe('onStructureChange', update)
  graph.subscribe('onGraphReset', update)

  return {
    maxFlow,
    trace,
    update,
  }
}