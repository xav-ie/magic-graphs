import { computed, ref } from "vue";
import type { Graph } from "@graph/types";
import type { SimulationRunner } from "@ui/product/sim/types";
import { useSourceSinkControls } from "./useSourceSinkControls";
import type { FlowTrace } from "./fordFulkerson"
import { useTextTip } from "@ui/useTextTip";
import { useSourceSinkStyler } from "./useSourceSinkStyler";
import { useEdgeThickener } from "./useEdgeThickener";
import { useResidualEdges } from "./useResidualEdges";
import { useSimulationTheme } from "./useSimulationTheme";
import { useSimulationControls } from "@ui/product/sim/useSimulationControls";
import { useFordFulkerson } from "./useFordFulkerson";

export type FlowSimulationRunner = SimulationRunner<FlowTrace>

export const useSimulationRunner = (graph: Graph): FlowSimulationRunner => {
  const srcSink = useSourceSinkControls(graph);

  const { text } = useTextTip();

  const {
    activate: activeEdgeThickener,
    deactivate: deactivateEdgeThickener
  } = useEdgeThickener(graph)

  const {
    stylize: activateFlowColorizer,
    destylize: deactivateFlowColorizer
  } = useSourceSinkStyler(graph, srcSink)


  const { createResidualEdges, cleanupResidualEdges } = useResidualEdges(graph)

  const { trace } = useFordFulkerson(graph, {
    source: srcSink.source,
    sink: srcSink.sink
  })

  const simControls = useSimulationControls(trace)

  const { activate: activateTheme, deactivate: deactivateTheme } = useSimulationTheme(graph, simControls)

  const running = ref(false);

  const start = async () => {
    if (running.value) return
    running.value = true

    activateFlowColorizer()
    activeEdgeThickener()
    text.value = 'Select a source node'
    await srcSink.setSourceNode()
    text.value = 'Select a sink node'
    await srcSink.setSinkNode()
    text.value = undefined

    createResidualEdges()
    activateTheme()
    simControls.start()
  }

  const stop = () => {
    if (!running.value) return

    srcSink.cancelSetSourceNode.value?.()
    srcSink.cancelSetSinkNode.value?.()

    simControls.stop()
    cleanupResidualEdges()
    deactivateTheme()

    deactivateFlowColorizer()
    deactivateEdgeThickener()
    srcSink.source.value = undefined
    srcSink.sink.value = undefined
    text.value = undefined

    running.value = false
  }

  return {
    start,
    stop,
    running: computed(() => running.value),
    simControls,
  }
}