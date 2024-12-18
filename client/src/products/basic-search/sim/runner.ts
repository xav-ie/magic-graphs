import { computed, type ComputedRef } from "vue";
import type { Graph } from "@graph/types";
import { useTextTip } from "@ui/useTextTip";
import type { SimulationRunner } from "@ui/product/sim/types";
import { useSimulationControls } from "@ui/product/sim/useSimulationControls";
import { useBFS } from "../algo/useBFS";
import { useDFS } from "../algo/useDFS";
import { useSimulationTheme } from "./theme";
import state from "../state";
import type { BasicSearchTrace } from "../algo/types";

export type BasicSearchSimulationRunner = SimulationRunner<BasicSearchTrace>;

const useSimulationRunner = (
  graph: Graph,
  trace: ComputedRef<BasicSearchTrace>
): BasicSearchSimulationRunner => {
  const lastStep = computed(() => trace.value.length - 1);
  const simControls = useSimulationControls(graph, trace, { lastStep });
  const { activate: theme, deactivate: untheme } = useSimulationTheme(graph, simControls);
  const { showText, hideText } = useTextTip("select the starting node");

  const start = async () => {
    showText();
    await state.setNode(graph, state.startNode);
    simControls.start();
    theme();
    hideText();
  };

  const stop = () => {
    state.cancelNodeSelection.value?.();
    simControls.stop();
    untheme();
    hideText();
  };

  return {
    start,
    stop,
    simControls,
  };
}

export const useBFSSimulationRunner = (graph: Graph) => {
  const { trace } = useBFS(graph);
  return useSimulationRunner(graph, trace);
}

export const useDFSSimulationRunner = (graph: Graph) => {
  const { trace } = useDFS(graph);
  return useSimulationRunner(graph, trace);
}