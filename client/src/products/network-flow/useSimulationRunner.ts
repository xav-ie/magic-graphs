import type { Graph } from "@graph/types";
import type { SimulationControls, SimulationRunner } from "@ui/product/sim/types";
import state from "./state";
import type { FlowTrace } from "./fordFulkerson"
import { useTextTip } from "@ui/useTextTip";
import { useSourceSinkStyler } from "./useSourceSinkStyler";
import { useEdgeThickener } from "./useEdgeThickener";
import { useResidualEdges } from "./useResidualEdges";
import { useSimulationTheme } from "./useSimulationTheme";
import { useSimulationControls } from "@ui/product/sim/useSimulationControls";
import { useFordFulkerson } from "./useFordFulkerson";

export type FlowSimulationControls = SimulationControls<FlowTrace>
export type FlowSimulationRunner = SimulationRunner<FlowTrace>

export const useSimulationRunner = (graph: Graph): FlowSimulationRunner => {
  const { text } = useTextTip();

  const {
    activate: activeEdgeThickener,
    deactivate: deactivateEdgeThickener
  } = useEdgeThickener(graph)

  const {
    stylize: activateFlowColorizer,
    destylize: deactivateFlowColorizer
  } = useSourceSinkStyler(graph)

  const { createResidualEdges, cleanupResidualEdges } = useResidualEdges(graph)

  const { sourceNode, sinkNode } = state
  const { trace } = useFordFulkerson(graph)
  const simControls = useSimulationControls(trace)

  const { activate: activateTheme, deactivate: deactivateTheme } = useSimulationTheme(graph, simControls)

  let cancelled = false;

  const start = async () => {
    graph.settings.value.persistent = false;

    activateFlowColorizer()
    activeEdgeThickener()

    text.value = 'Select a source node'
    await state.setNode(graph, sourceNode)

    if (cancelled) return

    text.value = 'Select a sink node'
    await state.setNode(graph, sinkNode)

    text.value = undefined

    if (cancelled) return

    createResidualEdges()
    activateTheme()

    simControls.start()
  }

  const stop = async () => {
    cancelled = true

    state.cancelNodeSelection.value?.()

    simControls.stop()
    cleanupResidualEdges()
    deactivateTheme()

    deactivateFlowColorizer()
    deactivateEdgeThickener()

    text.value = undefined
    graph.settings.value.persistent = true

    setTimeout(() => cancelled = false, 0)
  }

  return {
    start,
    stop,
    simControls,
  }
}