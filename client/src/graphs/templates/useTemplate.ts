import type { Graph } from "@graph/types";
import type { GraphTemplate } from "./types";
import { onMounted, ref } from "vue";
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

  // onMounted(() => {
  //   templates.value = loadTemplates();
  // })
  
  const addCurrentGraphAsTemplate = (templateDetails: Pick<GraphTemplate, "title" | "description">) => {
    const { nodes, edges } = graph;
    templates.value.push({
      id: '10',
      ...templateDetails,
      graphState: {
        nodes: nodes.value,
        edges: edges.value
      }
    })
    console.log(templates.value)
  };
  
  const loadTemplate = (templateId: GraphTemplate["id"]) => {
    const template = templates.value.find((t) => t.id === templateId);
    console.log(template)
    if (template === undefined) {
      throw new Error(`template could not be loaded: ${templateId} not found`);
    }
    
    const { nodes, edges } = template.graphState;
    const { x, y } = getAverageCoordinatesOfGraphNodes(graph.nodes.value);
    graph.load({
      nodes: centerNodesOnOriginCoordinates(nodes, { x, y }),
      edges: [],
    });
  };

  return {
    addCurrentGraphAsTemplate,
    loadTemplate,
  };
};
