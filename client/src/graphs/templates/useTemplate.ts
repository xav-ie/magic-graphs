import type { Graph } from "@graph/types";
import type { GraphTemplate } from "./types";
import { computed, ref } from "vue";
import {
  centerNodesOnOriginCoordinates,
  getAverageCoordinatesOfGraphNodes,
  getGraphNodesBoundingBox,
} from "./helpers";
import { generateId } from "@utils/id";
import { useLocalStorage } from "@vueuse/core";
import { createImageFromCanvasRegion } from "./snapshot";

export const useTemplate = (graph: Graph) => {
  const userTemplates = useLocalStorage<GraphTemplate[]>(
    "user-graph-templates",
    []
  );
  const productTemplates = ref<GraphTemplate[]>([]);

  const templates = computed(() => [
    ...productTemplates.value,
    ...userTemplates.value,
  ]);

  const addCurrentGraphAsTemplate = (
    templateDetails: Pick<GraphTemplate, "title" | "description" | "thumbnail">
  ) => {
    const { nodes, edges } = graph;

    const nodeRadius = graph.baseTheme.value.nodeSize;
    const nodeBorderWidth = graph.baseTheme.value.nodeBorderWidth;
    const boundingBox = getGraphNodesBoundingBox(
      nodes.value,
      nodeRadius + nodeBorderWidth / 2
    );

    if (!graph.canvas.value) return;

    const thumbnail = createImageFromCanvasRegion(
      graph.canvas.value,
      boundingBox
    );

    userTemplates.value.push({
      id: generateId(),
      thumbnail,
      ...templateDetails,

      graphState: {
        nodes: JSON.parse(JSON.stringify(nodes.value)),
        edges: JSON.parse(JSON.stringify(edges.value)),
      },
    });
  };

  const loadTemplate = (templateId: GraphTemplate["id"]) => {
    const template = templates.value.find((t) => t.id === templateId);
    if (template === undefined) {
      throw new Error(`template could not be loaded: ${templateId} not found`);
    }

    const { nodes, edges } = template.graphState;
    const { x, y } = getAverageCoordinatesOfGraphNodes(graph.nodes.value);
    graph.load({
      nodes: centerNodesOnOriginCoordinates(nodes, { x, y }),
      edges,
    });
  };

  const clearUserTemplates = () => (userTemplates.value = []);

  const deleteUserTemplate = (templateId: GraphTemplate["id"]) => {
    userTemplates.value = userTemplates.value.filter(
      (t) => t.id !== templateId
    );
  };

  return {
    addCurrentGraphAsTemplate,
    loadTemplate,
    clearUserTemplates,
    deleteUserTemplate,

    templates,
    userTemplates,
    productTemplates,
  };
};
