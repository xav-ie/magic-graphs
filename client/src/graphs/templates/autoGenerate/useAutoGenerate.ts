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
import { graphLabelGetter, LETTERS } from "@graph/labels";

export const useAutoGenerate = (graph: Graph) => {
  const generateNodes = (nodeCount: number) => {
    const nodes = ref<GNode[]>([]);

    const getLabel = graphLabelGetter(nodes, LETTERS);

    for (let i = 0; i < nodeCount; i++) {
      nodes.value.push({
        id: generateId(),
        label: getLabel(),
        x: 0,
        y: 0,
      });
    }
    return nodes;
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
    const angleStep = (2 * Math.PI) / nodes.length;
    const radius = graph.baseTheme.value.nodeSize * GOLDEN_RATIO;
    const circularNodes = nodes.map((node, index) => ({
      ...node,
      x: Math.cos(angleStep * index) * radius * 8,
      y: Math.sin(angleStep * index) * radius * 8,
    }));
    return circularNodes;
  };

  const gridLayout = (nodes: GNode[]) => {
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
    return gridNodes;
  };

  const generatePartialMesh = (
    nodes: GNode[],
    edgeLabel: AutoGenerateGraphOptions["edgeLabel"],
    connectionProbability: number, // Between 0 and 1
    maxConnectionsPerNode: number // Optional limit per node
  ): { nodes: GNode[]; edges: GEdge[] } => {
    const edges: GEdge[] = [];
    const connections = new Map<string, number>();
    const existingEdges = new Set<string>();

    // Clamp connection probability between 0 and 1
    connectionProbability = Math.max(0, Math.min(1, connectionProbability));

    // Initialize connection counts for each node
    nodes.forEach((node) => connections.set(node.id, 0));

    const addEdge = (from: string, to: string) => {
      const edgeKey = `${from}-${to}`;
      if (existingEdges.has(edgeKey)) return;

      const label =
        typeof edgeLabel === "function" ? edgeLabel(from, to) : edgeLabel!;
      edges.push({
        id: generateId(),
        from,
        to,
        label,
      });
      connections.set(from, (connections.get(from) || 0) + 1);
      connections.set(to, (connections.get(to) || 0) + 1);
      existingEdges.add(edgeKey);
      existingEdges.add(`${to}-${from}`); // Undirected edge
    };

    // Step 1: Create a spanning tree to ensure connectivity
    for (let i = 0; i < nodes.length - 1; i++) {
      addEdge(nodes[i].id, nodes[i + 1].id);
    }

    // Step 2: Add additional random edges based on connection probability
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() < connectionProbability) {
          const nodeA = nodes[i].id;
          const nodeB = nodes[j].id;

          // Ensure connection limits are respected
          if (
            (connections.get(nodeA) || 0) < maxConnectionsPerNode &&
            (connections.get(nodeB) || 0) < maxConnectionsPerNode
          ) {
            addEdge(nodeA, nodeB);
          }
        }
      }
    }

    return { nodes, edges };
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
      case "partialMesh": {
        const graphState = generatePartialMesh(nodes.value, edgeLabel, 0.75, 4);
        nodes.value = circularLayout(graphState.nodes);
        edges.value = graphState.edges;
        break;
      }
    }
    const origin = getAverageCoordinatesOfNodes(graph.nodes.value);
    const centeredNodes = centerNodesOnOriginCoordinates(nodes.value, origin);

    graph.load({
      nodes: centeredNodes,
      edges: edges.value,
    });
  };

  return {
    generate,
  };
};
