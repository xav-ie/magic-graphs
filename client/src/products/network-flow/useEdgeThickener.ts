import { onUnmounted } from "vue";
import { useTheme } from "@graph/themes/useTheme";
import type { GEdge, Graph } from "@graph/types";

export const EDGE_THICKENER_USETHEME_ID = 'edge-thickener';

const MIN_THICKNESS = 5;
const MAX_THICKNESS = 25;

export const useEdgeThickener = (graph: Graph) => {
  const { setTheme, removeAllThemes } = useTheme(graph, EDGE_THICKENER_USETHEME_ID);

  const thickener = (edge: GEdge) => {
    const edgeWeight = Number(edge.label);
    if (isNaN(edgeWeight)) return;
    if (edgeWeight === 0) return 3;
    const adjustedWeight = edgeWeight * 2
    const rawPercentage = (adjustedWeight - MIN_THICKNESS) / (MAX_THICKNESS - MIN_THICKNESS);
    const percentage = Math.min(1, Math.max(0, rawPercentage));
    return ((MAX_THICKNESS - MIN_THICKNESS) * percentage) + MIN_THICKNESS;
  }

  const activate = () => setTheme('edgeWidth', thickener);
  const deactivate = () => removeAllThemes();

  onUnmounted(deactivate);

  activate();

  return {
    activate,
    deactivate
  };
};

export type EdgeThickenerControls = ReturnType<typeof useEdgeThickener>;