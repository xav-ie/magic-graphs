import type { GEdge, Graph } from "@graph/types";
import type { MSTTrace } from "./useSimulationRunner";
import type { SimulationControls } from "@ui/product/sim/types";
import { useTheme } from "@graph/themes/useTheme";
import { getValue } from "@graph/helpers";

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
  const mst = sim.trace;

  const colorEdge = (edge: GEdge) => {
    if (graph.isFocused(edge.id)) return;
    const inMST = mst.value.some((e) => e.id === edge.id);
    const regularColor = getValue(graph.theme.value.edgeColor, edge);
    if (inMST) return regularColor;
    else return regularColor + DIM_FACTOR;
  }

  const colorEdgeText = (edge: GEdge) => {
    if (graph.isFocused(edge.id)) return;
    const inMST = mst.value.some((e) => e.id === edge.id);
    const regularColor = getValue(graph.theme.value.edgeTextColor, edge);
    if (inMST) return regularColor;
    else return regularColor + DIM_FACTOR;
  }

  const activate = () => {
    console.log('activate')
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