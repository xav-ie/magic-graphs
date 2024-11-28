import type { GEdge, Graph } from "@graph/types";
import { useKruskal } from "./useKruskal";
import { usePrim } from "./usePrim";
import { useSimulationControls } from "@ui/product/sim/useSimulationControls";
import type { SimulationControls, SimulationRunner } from "@ui/product/sim/types";
import { computed, watch } from "vue";
import { useSimulationTheme } from "./useSimulationTheme";

export type MSTTrace = GEdge[];
export type MSTSimulationControls = SimulationControls<MSTTrace>;
export type MSTSimulationRunner = SimulationRunner<MSTTrace>;

export const useMSTSimulationRunner = (
  graph: Graph,
  trace: MSTSimulationControls['trace']
): MSTSimulationRunner => {
  const simControls = useSimulationControls(trace);
  const { activate, deactivate } = useSimulationTheme(graph, simControls);
  return {
    simControls,
    start: () => {
      activate();
      simControls.start();
    },
    stop: () => {
      deactivate();
      simControls.stop();
    },
    running: simControls.isActive,
  }
}

export const usePrimSimulationRunner = (graph: Graph) => {
  const trace = usePrim(graph);
  return useMSTSimulationRunner(graph, trace);
}

export const useKruskalSimulationRunner = (graph: Graph) => {
  const trace = useKruskal(graph);
  return useMSTSimulationRunner(graph, trace);
}