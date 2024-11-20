import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { GNode, Graph } from '@graph/types'
import { fordFulkerson } from './fordFulkerson'
import type { FlowTrace } from './fordFulkerson'
import { useResidualEdges } from './useResidualEdges'

/**
 * reactive Ford-Fulkerson algorithm
 */
export const useFordFulkerson = (graph: Graph, nodes: {
  source: Ref<GNode | undefined>,
  sink: Ref<GNode | undefined>
}) => {
  const trace = ref<FlowTrace>([])
  const maxFlow = ref(0)

  const { createResidualEdges, cleanupResidualEdges } = useResidualEdges(graph)

  const update = () => {
    if (!nodes.source.value || !nodes.sink.value) return
    if (nodes.source.value.id === nodes.sink.value.id) {
      maxFlow.value = 0
      trace.value = []
      return
    }
    createResidualEdges()
    const { maxFlow: gotMaxFlow, trace: gotTrace } = fordFulkerson(graph, {
      sourceId: nodes.source.value.id,
      sinkId: nodes.sink.value.id,
    })
    trace.value = gotTrace
    maxFlow.value = gotMaxFlow
    cleanupResidualEdges()
  }

  graph.subscribe('onEdgeLabelChange', update)
  graph.subscribe('onStructureChange', update)
  graph.subscribe('onGraphReset', update)

  watch([nodes.source, nodes.sink], update)

  update()

  return {
    maxFlow,
    trace,
    update,
  }
}