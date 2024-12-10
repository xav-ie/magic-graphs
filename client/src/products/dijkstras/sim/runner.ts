import type { Graph } from "@graph/types";
import { useTextTip } from "@ui/useTextTip";
import type { SimulationRunner } from "@ui/product/sim/types";
import { useSimulationControls } from "@ui/product/sim/useSimulationControls";
import { useDijkstra } from "../algo/useDijkstra";
import type { DijkstrasTrace } from "../algo/useDijkstra";
import { useSimulationTheme } from "./theme";
import state from "../state";
import { computed } from "vue";

export type DijkstraSimulationRunner = SimulationRunner<DijkstrasTrace>;

export const useSimulationRunner = (graph: Graph): DijkstraSimulationRunner => {
  const { trace } = useDijkstra(graph)
  const lastStep = computed(() => trace.value.length - 1);
  const simControls = useSimulationControls(trace, { lastStep });
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