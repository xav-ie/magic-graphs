import { computed } from "vue";
import type { GEdge, Graph } from "@graph/types";
import type { SimulationControls } from "@ui/product/sim/types";
import type { FlowTrace } from "./fordFulkerson";
import { FLOW_USETHEME_ID } from "./constants";
import { useTheme } from "@graph/themes/useTheme";
import colors from "@utils/colors";
import { getValue } from "@graph/helpers";
import { isResidual } from "./useResidualEdges";

export const useSimulationTheme = (graph: Graph, sim: SimulationControls<FlowTrace>) => {
  const { setTheme, removeTheme } = useTheme(graph, FLOW_USETHEME_ID)

  const getActiveEdgeIdsAtStep = (step: number) => {
    const traceAtStep =  sim.trace.value[step]
    if (!traceAtStep) return []
    const edgeIdsAtStep = Object.keys(traceAtStep)
    return edgeIdsAtStep
  }

  const activeEdgeIdsAtStep = computed(() => getActiveEdgeIdsAtStep(sim.step.value))

  const edgeWeightMapAtStep = computed(() => {
    const maps = []
    const currentMap: Map<GEdge['id'], number> = new Map()

    for (let i = -1; i <= sim.trace.value.length; i++) {
      const traceAtStep = sim.trace.value[i]

      if (!traceAtStep) {
        maps.push(new Map(currentMap))
        continue
      }

      for (const edgeId in traceAtStep) {
        const edge = graph.getEdge(edgeId)
        if (!edge) throw 'edge not found'
        const weight = traceAtStep[edgeId]
        currentMap.set(edge.id, weight)
      }

      maps.push(new Map(currentMap))
    }

    return maps
  })

  const weightMapAtStep = computed(() => edgeWeightMapAtStep.value[sim.step.value + 1])

  const colorActiveEdges = (edge: GEdge) => {
    const isActive = activeEdgeIdsAtStep.value.includes(edge.id)
    const focusColor = getValue(graph.theme.value.edgeFocusColor, edge)
    if (isActive) return focusColor
    else if (isResidual(edge.id)) return colors.ORANGE_400
  }

  const labelEdges = (edge: GEdge) => {
    const weight = weightMapAtStep.value.get(edge.id)
    if (weight === undefined) return edge.label
    return weight.toString()
  }

  const activate = () => {
    setTheme('edgeColor', colorActiveEdges)
    setTheme('edgeText', labelEdges)
  }

  const deactivate = () => {
    removeTheme('edgeColor')
    removeTheme('edgeText')
  }

  return {
    activate,
    deactivate
  }
}