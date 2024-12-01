import { computed, ref, watch } from 'vue'
import state from './state'
import type { Graph } from '@graph/types'
import { fordFulkerson } from './fordFulkerson'
import type { FlowTrace } from './fordFulkerson'
import { useResidualEdges } from './useResidualEdges'

/**
 * reactive Ford-Fulkerson algorithm
 */
export const useFordFulkerson = (graph: Graph) => {
  const trace = ref<FlowTrace>([])
  const maxFlow = ref(0)

  const { createResidualEdges, cleanupResidualEdges } = useResidualEdges(graph)
  const { sourceNode, sinkNode } = state

  const update = () => {
    if (!sourceNode.value || !sinkNode.value) return
    if (sourceNode.value.id === sinkNode.value.id) {
      maxFlow.value = 0
      trace.value = []
      return
    }

    createResidualEdges()
    const { maxFlow: gotMaxFlow, trace: gotTrace } = fordFulkerson(graph, {
      sourceId: sourceNode.value.id,
      sinkId: sinkNode.value.id,
    })
    trace.value = gotTrace
    maxFlow.value = gotMaxFlow
    cleanupResidualEdges()
  }

  graph.subscribe('onEdgeLabelChange', update)
  graph.subscribe('onStructureChange', update)
  graph.subscribe('onGraphReset', update)

  watch([sourceNode, sinkNode], update, { immediate: true })

  return {
    maxFlow,
    trace: computed(() => [{}, ...trace.value]),
  }
}