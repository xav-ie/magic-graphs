import { computed } from "vue";
import type { GEdge, Graph } from "@graph/types";
import type { MSTTrace } from "./runner";
import type { SimulationControls } from "@ui/product/sim/types";
import { useTheme } from "@graph/themes/useTheme";
import { getValue } from "@utils/maybeGetter";

/**
 * dims the color of the edge if it is not in the MST to ${DIM_FACTOR}%
 */
const DIM_FACTOR = 20;

export const MST_USETHEME_ID = "mst";

export const useSimulationTheme = (
  graph: Graph,
  sim: SimulationControls<MSTTrace>
) => {
  const { setTheme, removeAllThemes } = useTheme(graph, MST_USETHEME_ID);
  const mstAtStep = computed(() => sim.trace.value.slice(0, sim.step.value));

  const colorEdge = (edge: GEdge) => {
    if (graph.isFocused(edge.id)) return;

    const regularColor = getValue(graph.theme.value.edgeColor, edge);

    const inMST = mstAtStep.value.some((e) => e.id === edge.id);
    if (inMST) return regularColor;
    else return regularColor + DIM_FACTOR;
  }

  const colorEdgeText = (edge: GEdge) => {
    if (graph.isFocused(edge.id)) return;

    const regularColor = getValue(graph.theme.value.edgeTextColor, edge);

    const inMST = mstAtStep.value.some((e) => e.id === edge.id);
    if (inMST) return regularColor;
    else return regularColor + DIM_FACTOR;
  }

  const activate = () => {
    setTheme("edgeColor", colorEdge);
    setTheme("edgeTextColor", colorEdgeText);
  }

  const deactivate = () => {
    removeAllThemes();
  }

  return {
    activate,
    deactivate,
  }
}