import type { Graph } from "@graph/types";
import type { GraphTemplate } from "./types";
import { computed, ref } from "vue";
import {
  centerNodesOnOriginCoordinates,
  getAverageCoordinatesOfGraphNodes,
} from "./helpers";
import { generateId } from "@utils/id";

export const useTemplate = (graph: Graph) => {

  const userTemplates = ref<GraphTemplate[]>([]);
  const productTemplates = ref<GraphTemplate[]>([]);

  const templates = computed(() => [...productTemplates.value, ...userTemplates.value]);

  const addCurrentGraphAsTemplate = (templateDetails: Pick<GraphTemplate, "title" | "description">) => {
    const { nodes, edges } = graph;
    userTemplates.value.push({
      id: generateId(),
      ...templateDetails,
      graphState: {
        nodes: JSON.parse(JSON.stringify(nodes.value)),
        edges: JSON.parse(JSON.stringify(edges.value))
      }
    })
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
      edges
    });
  };

  const clearUserTemplates = () => userTemplates.value = [];

  const deleteUserTemplate = (templateId: GraphTemplate["id"]) => {
    userTemplates.value = userTemplates.value.filter((t) => t.id !== templateId);
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
