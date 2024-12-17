import type { Graph } from "@graph/types";
import type { GraphTemplate } from "./types";
import { ref } from "vue";
import {
  centerNodesOnOriginCoordinates,
  getAverageCoordinatesOfGraphNodes,
} from "./helpers";
import { generateId } from "@utils/id";

export const useTemplate = (graph: Graph) => {
  const templates = ref<GraphTemplate[]>([
    {
      id: generateId(),
      thumbnail: "",
      title: "Test Template",
      description: "This is a test",
      graphState: {
        nodes: [],
        edges: []
      }
    }
  ]);

  const addCurrentGraphAsTemplate = (templateDetails: Pick<GraphTemplate, "title" | "description">) => {
    const { nodes, edges } = graph;
    templates.value.push({
      id: '10',
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
    // currently only works after moving the nodes around 2x. why????
    const { x, y } = getAverageCoordinatesOfGraphNodes(graph.nodes.value);
    graph.load({
      nodes: centerNodesOnOriginCoordinates(nodes, { x, y }),
      edges
    });
  };

  const clearTemplates = () => templates.value = [];

  return {
    addCurrentGraphAsTemplate,
    loadTemplate,
    clearTemplates,
  };
};
