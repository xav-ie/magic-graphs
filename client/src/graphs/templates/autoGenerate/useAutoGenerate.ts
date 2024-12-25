import type { GEdge, GNode, Graph } from "@graph/types";
import type { AutoGenerateGraphOptions } from "./types";
import { ref } from "vue";
import {
  centerNodesOnOriginCoordinates,
  getAverageCoordinatesOfNodes,
} from "../helpers";
import {
  generateClusterNodes,
  generateCohesiveEdges,
} from "./generationAlgorithms/randomGeneration";
import { AUTO_GENERATE_GRAPH_DEFAULTS } from "./types";

export const useAutoGenerate = (graph: Graph) => {
  const options = ref<AutoGenerateGraphOptions>({
    ...AUTO_GENERATE_GRAPH_DEFAULTS,
  });

  const nodes = ref<GNode[]>([]);
  const edges = ref<GEdge[]>([]);

  const generate = () => {
    const generatedNodes = generateClusterNodes(options.value);
    const origin = getAverageCoordinatesOfNodes(graph.nodes.value);
    const centeredNodes = centerNodesOnOriginCoordinates(
      generatedNodes,
      origin
    );
    edges.value = generateCohesiveEdges(centeredNodes, options.value);
    nodes.value = centeredNodes;
    graph.load({ nodes: nodes.value, edges: edges.value });
  };

  return {
    generate,

    options,
    nodes,
    edges,
  };
};
