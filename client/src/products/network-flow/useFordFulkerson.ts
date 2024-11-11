import { ref } from 'vue'
import { fordFulkerson } from './fordFulkerson'
import type { FlowTrace } from './fordFulkerson'
import type { Graph } from '@graph/types'
import { SINK_LABEL, SOURCE_LABEL } from './useFlowControls'
import { useResidualEdges } from './useResidualEdges'

export const useFordFulkerson = (graph: Graph) => {
  const trace = ref<FlowTrace>([])
  const maxFlow = ref(0)

  const { createResidualEdges, cleanupResidualEdges } = useResidualEdges(graph)

  const update = () => {
    const src = graph.nodes.value.find(n => n.label === SOURCE_LABEL)
    const sink = graph.nodes.value.find(n => n.label === SINK_LABEL)
    if (!src || !sink) return trace.value = []
    createResidualEdges()
    const { maxFlow: gotMaxFlow, trace: gotTrace } = fordFulkerson(graph, src.id, sink.id)
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