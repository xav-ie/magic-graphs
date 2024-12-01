import { computed, readonly, ref, watch } from 'vue'
import state from '../state'
import type { Graph } from '@graph/types'
import { fordFulkerson } from './fordFulkerson'
import type { FlowTrace } from './fordFulkerson'
import { useResidualEdges } from '../misc/useResidualEdges'

/**
 * reactive Ford-Fulkerson algorithm
 */
export const useFordFulkerson = (graph: Graph) => {
  const trace = ref<FlowTrace>([])
  const maxFlow = ref<number>()

  const { createResidualEdges, cleanupResidualEdges } = useResidualEdges(graph)
  const { sourceNode, sinkNode } = state

  const update = () => {
    if (!sourceNode.value || !sinkNode.value) return
    const validSourceNode = graph.getNode(sourceNode.value.id)
    const validSinkNode = graph.getNode(sinkNode.value.id)
    if (!validSourceNode || !validSinkNode) return

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
    output: {
      maxFlow: readonly(maxFlow),
    },
    trace: computed(() => [{}, ...trace.value]),
  }
}