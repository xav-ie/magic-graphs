import type { Graph } from "@graph/types";
import type { GraphTemplate } from "./types";
import { ref } from "vue";
import { getAverageCoordinatesOfGraphNodes } from "./helpers";

export const useTemplate = (graph: Graph): GraphTemplate[] => {

  const { x, y } = getAverageCoordinatesOfGraphNodes(graph.nodes.value);

  return []
}