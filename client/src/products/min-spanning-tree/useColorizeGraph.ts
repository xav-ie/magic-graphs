import type { GEdge, Graph } from "@graph/types";
import { useTheme } from "@graph/themes/useTheme";
import { getValue } from "@graph/helpers";

export const useColorizeGraph = (graph: Graph, mst: GEdge[]) => {
  const { setTheme } = useTheme(graph, "mst");

  setTheme("edgeColor", (edge) => {
    if (graph.isHighlighted(edge.id)) return;
    const inMST = mst.some((e) => e.id === edge.id);
    const regularColor = getValue(graph.theme.value.edgeColor, edge);
    if (inMST) return regularColor;
    else return regularColor + "20";
  });

  setTheme("edgeTextColor", (edge) => {
    if (graph.isHighlighted(edge.id)) return;
    const inMST = mst.some((e) => e.id === edge.id);
    const regularColor = getValue(graph.theme.value.edgeTextColor, edge);
    if (inMST) return regularColor;
    else return regularColor + "20";
  });
};
