import type { GEdge, Graph } from "@graph/types";
import { useTheme } from "@graph/themes/useTheme";
import { getValue } from "@graph/helpers";
import type { Ref } from "vue";

/**
 * dims the color of the edge if it is not in the MST to ${DIM_FACTOR}%
 */
const DIM_FACTOR = 20;

export const MST_USETHEME_ID = "mst";

export const useMSTColorizer = (graph: Graph, mst: Ref<GEdge[]>) => {
  const { setTheme, removeAllThemes } = useTheme(graph, MST_USETHEME_ID);

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

  const colorize = () => {
    setTheme("edgeColor", colorEdge);
    setTheme("edgeTextColor", colorEdgeText);
  }

  const decolorize = () => {
    removeAllThemes();
  }

  return { colorize, decolorize };
};
