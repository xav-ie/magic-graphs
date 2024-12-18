import type { Graph } from "@graph/types";
import type { SimulationControls, SimulationRunner } from "@ui/product/sim/types";
import { useSimulationControls } from "@ui/product/sim/useSimulationControls";
import state from "../state";
import { FLOW_USETHEME_ID } from "../constants";
import type { FlowTrace } from "../algo/fordFulkerson"
import { useFordFulkerson } from "../algo/useFordFulkerson";
import { useSourceSinkTheme } from "../theme/useSourceSinkTheme";
import { useEdgeThickener } from "../theme/useEdgeThickener";
import { useResidualEdges } from "../misc/useResidualEdges";
import { useSimulationTheme } from "./theme";

export type FlowSimulationControls = SimulationControls<FlowTrace>
export type FlowSimulationRunner = SimulationRunner<FlowTrace>

const RUNNER_USETHEME_ID = FLOW_USETHEME_ID + '-runner'
const { sourceNode, sinkNode } = state

export const useSimulationRunner = (graph: Graph): FlowSimulationRunner => {
  const {
    activate: activeEdgeThickener,
    deactivate: deactivateEdgeThickener
  } = useEdgeThickener(graph, RUNNER_USETHEME_ID)

  const {
    stylize: activateFlowColorizer,
    destylize: deactivateFlowColorizer
  } = useSourceSinkTheme(graph, RUNNER_USETHEME_ID)

  const { createResidualEdges, cleanupResidualEdges } = useResidualEdges(graph)

  const { trace } = useFordFulkerson(graph)
  const simControls = useSimulationControls(graph, trace, {
    allowEditingDuringPlayback: false,
  })

  const {
    activate: activateTheme,
    deactivate: deactivateTheme
  } = useSimulationTheme(graph, simControls)

  const start = async () => {
    graph.settings.value.persistent = false;

    activateFlowColorizer()
    activeEdgeThickener()

    if (sourceNode.isUndefined.value) await sourceNode.set(graph)
    if (sourceNode.isUndefined.value) return

    if (sinkNode.isUndefined.value) await sinkNode.set(graph)
    if (sinkNode.isUndefined.value) return

    createResidualEdges()
    activateTheme()

    simControls.start()
  }

  const stop = async () => {
    sourceNode.cancelSet()
    sinkNode.cancelSet()

    simControls.stop()
    cleanupResidualEdges()
    deactivateTheme()

    deactivateFlowColorizer()
    deactivateEdgeThickener()

    graph.settings.value.persistent = true
  }

  return {
    start,
    stop,
    simControls,
  }
}