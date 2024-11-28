import { computed, ref } from "vue";
import type { Graph } from "@graph/types";
import type { SimulationRunner } from "@ui/product/sim/types";
import { useSourceSinkControls } from "./useSourceSinkControls";
import { useSimulation } from "./useSimulation";
import type { FlowTrace } from "./fordFulkerson"
import { useTextTip } from "@ui/useTextTip";
import { useSourceSinkStyler } from "./useSourceSinkStyler";
import { useEdgeThickener } from "./useEdgeThickener";
import { useResidualEdges } from "./useResidualEdges";

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
  const simControls = useSimulation(graph, {
    source: srcSink.source,
    sink: srcSink.sink
  });

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
    simControls.start()
  }

  const stop = () => {
    if (!running.value) return

    srcSink.cancelSetSourceNode.value?.()
    srcSink.cancelSetSinkNode.value?.()

    simControls.stop()
    cleanupResidualEdges()

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