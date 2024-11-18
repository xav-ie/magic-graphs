import { onUnmounted } from "vue";
import { useTheme } from "@graph/themes/useTheme";
import type { GEdge, Graph } from "@graph/types";
import { FLOW_USETHEME_ID } from "./constants";

const MIN_THICKNESS = 5;
const MAX_THICKNESS = 25;

/**
 * when the edge weight is 0, the edge thickness is set to this value
 */
const ZERO_THICKNESS = 3;

export const useEdgeThickener = (graph: Graph) => {
  const { setTheme, removeTheme } = useTheme(graph, FLOW_USETHEME_ID);

  const thickener = (edge: GEdge) => {
    const edgeWeight = Number(edge.label);
    if (isNaN(edgeWeight)) return;
    if (edgeWeight === 0) return ZERO_THICKNESS;
    const adjustedWeight = edgeWeight * 2
    const rawPercentage = (adjustedWeight - MIN_THICKNESS) / (MAX_THICKNESS - MIN_THICKNESS);
    const percentage = Math.min(1, Math.max(0, rawPercentage));
    return ((MAX_THICKNESS - MIN_THICKNESS) * percentage) + MIN_THICKNESS;
  }

  const activate = () => setTheme('edgeWidth', thickener);
  const deactivate = () => removeTheme('edgeWidth');

  onUnmounted(deactivate);

  activate();

  return {
    activate,
    deactivate
  };
};

export type EdgeThickenerControls = ReturnType<typeof useEdgeThickener>;