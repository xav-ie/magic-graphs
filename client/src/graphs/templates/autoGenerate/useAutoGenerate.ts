import type { GEdge, GNode, Graph } from "@graph/types";
import type { AutoGenerateGraphOptions } from "./types";
import { DEFAULT_AUTO_GENERATE_GRAPH_OPTIONS } from "./types";
import { generateId } from "@utils/id";
import { GOLDEN_RATIO } from "@utils/math";
import {
  centerNodesOnOriginCoordinates,
  getAverageCoordinatesOfNodes,
} from "../helpers";
import { ref } from "vue";

export const useAutoGenerate = (graph: Graph) => {
  const generateNodes = (nodeCount: number) => {
    return Array.from({ length: nodeCount }, () => ({
      id: generateId(),
      label: "fhsdj",
      x: 10,
      y: 10,
    }));
  };

  const generateEdges = (
    nodes: GNode[],
    edgeCount: number,
    edgeLabel: AutoGenerateGraphOptions["edgeLabel"]
  ) => {
    const edges: GEdge[] = [];
    for (let i = 0; i < edgeCount; i++) {
      const fromNode = nodes[Math.floor(Math.random() * nodes.length)];
      const toNode = nodes[Math.floor(Math.random() * nodes.length)];
      const label =
        typeof edgeLabel === "function"
          ? edgeLabel(fromNode.id, toNode.id)
          : edgeLabel!;
      if (fromNode.id !== toNode.id) {
        edges.push({
          id: generateId(),
          from: fromNode.id,
          to: toNode.id,
          label,
        });
      }
    }
    return edges;
  };

  const circularLayout = (nodes: GNode[]) => {
    const origin = getAverageCoordinatesOfNodes(graph.nodes.value);
    console.log(origin);
    const angleStep = (2 * Math.PI) / nodes.length;
    const radius = graph.baseTheme.value.nodeSize * GOLDEN_RATIO;
    const circularNodes = nodes.map((node, index) => ({
      ...node,
      x: Math.cos(angleStep * index) * radius * 8,
      y: Math.sin(angleStep * index) * radius * 8,
    }));
    const centeredNodes = centerNodesOnOriginCoordinates(circularNodes, origin);
    return centeredNodes;
  };

  const gridLayout = (nodes: GNode[]) => {
    const origin = getAverageCoordinatesOfNodes(graph.nodes.value);

    const gridSize = Math.ceil(Math.sqrt(nodes.length));
    const cellSize = graph.baseTheme.value.nodeSize * GOLDEN_RATIO * 5;

    const gridNodes = nodes.map((node, index) => {
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      return {
        ...node,
        x: col * cellSize + cellSize / 2, // Center in the cell
        y: row * cellSize + cellSize / 2, // Center in the cell
      };
    });
    const centeredNodes = centerNodesOnOriginCoordinates(gridNodes, origin);
    return centeredNodes;
  };

  const generate = (options: AutoGenerateGraphOptions) => {
    const { numNodes, numEdges, edgeLabel, layout } = {
      ...DEFAULT_AUTO_GENERATE_GRAPH_OPTIONS,
      ...options,
    };

    const nodes = ref(generateNodes(numNodes) as GNode[]);
    const edges = ref(generateEdges(nodes.value, numEdges, edgeLabel));

    switch (layout) {
      case "circular":
        nodes.value = circularLayout(nodes.value);
        break;
      case "grid":
        nodes.value = gridLayout(nodes.value);
        break;
    }

    graph.load({
      nodes: nodes.value,
      edges: edges.value,
    });
  };

  return {
    generate,
  };
};
