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
import { generateClusterNodes, generateRandomEdges } from "./generationAlgorithms/randomGeneration";


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
    return nodes.value;
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
      x: Math.cos(angleStep * index) * radius * 7,
      y: Math.sin(angleStep * index) * radius * 7,
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
    connectionProbability: number,
    maxConnectionsPerNode: number = Infinity
  ): { nodes: GNode[]; edges: GEdge[] } => {
    const edges: GEdge[] = [];
    const connections = new Map<string, number>();
    const existingEdges = new Set<string>();

    connectionProbability = Math.max(0, Math.min(1, connectionProbability));

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
      existingEdges.add(`${to}-${from}`); 
    };

    for (let i = 0; i < nodes.length - 1; i++) {
      addEdge(nodes[i].id, nodes[i + 1].id);
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() < connectionProbability) {
          const nodeA = nodes[i].id;
          const nodeB = nodes[j].id;

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

  const forceDirectedLayout = (
    nodes: GNode[],
    edges: GEdge[],
    iterations: number = 100,
    width: number = 1000,
    height: number = 1000,
    buffer: number = 50, // minimum buffer zone between nodes
    perturbation: number = 50 // small random displacement to prevent colinearity
  ): GNode[] => {
    const area = width * height;
    const k = Math.sqrt(area / nodes.length); 
    let temperature = width / 10; 
  
    const repulsiveForce = (distance: number) => (k * k) / distance;
    const attractiveForce = (distance: number) => (distance * distance) / k;
  
    const isColinear = (a: GNode, b: GNode, c: GNode): boolean => {
      const crossProduct = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
      return Math.abs(crossProduct) < 1e-5; 
    };
  
    const applyPerturbation = (node: GNode) => {
      node.x += Math.random() * perturbation - perturbation / 2;
      node.y += Math.random() * perturbation - perturbation / 2;
    };
  
    for (let iter = 0; iter < iterations; iter++) {
      const displacements = new Map<string, { x: number; y: number }>();
      nodes.forEach((node) => displacements.set(node.id, { x: 0, y: 0 }));
  
      nodes.forEach((v) => {
        nodes.forEach((u) => {
          if (u.id !== v.id) {
            const dx = v.x - u.x;
            const dy = v.y - u.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 0.01; 
  
            let force = repulsiveForce(distance);
            if (distance < buffer) {
              force += (buffer - distance) * 2;
            }
  
            const disp = displacements.get(v.id)!;
            disp.x += (dx / distance) * force;
            disp.y += (dy / distance) * force;
          }
        });
      });
  
      edges.forEach((edge) => {
        const v = nodes.find((n) => n.id === edge.to)!;
        const u = nodes.find((n) => n.id === edge.from)!;
  
        const dx = v.x - u.x;
        const dy = v.y - u.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 0.01; 
        const force = attractiveForce(distance);
  
        const vDisp = displacements.get(v.id)!;
        const uDisp = displacements.get(u.id)!;
  
        vDisp.x -= (dx / distance) * force;
        vDisp.y -= (dy / distance) * force;
        uDisp.x += (dx / distance) * force;
        uDisp.y += (dy / distance) * force;
      });
  
      nodes.forEach((v) => {
        const disp = displacements.get(v.id)!;
        const dispMagnitude = Math.sqrt(disp.x * disp.x + disp.y * disp.y) || 0.01;
  
        v.x += (disp.x / dispMagnitude) * Math.min(dispMagnitude, temperature);
        v.y += (disp.y / dispMagnitude) * Math.min(dispMagnitude, temperature);
  
        v.x = Math.min(width / 2, Math.max(-width / 2, v.x));
        v.y = Math.min(height / 2, Math.max(-height / 2, v.y));
      });
  
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          for (let k = j + 1; k < nodes.length; k++) {
            if (isColinear(nodes[i], nodes[j], nodes[k])) {
              applyPerturbation(nodes[k]); 
            }
          }
        }
      }
  
      temperature *= 0.9;
    }
  
    return nodes;
  };

  const generate = (options: AutoGenerateGraphOptions) => {
    const { layout } = {
      ...DEFAULT_AUTO_GENERATE_GRAPH_OPTIONS,
      ...options,
    };

    const nodes = ref();
    const edges = ref();

    switch (layout) {
      case "circular":
        nodes.value = circularLayout(nodes.value);
        break;
      case "grid":
        nodes.value = gridLayout(nodes.value);
        break;
      case "partialMesh": {
        
        // const graphState = generatePartialMesh(nodes.value, edgeLabel, 0.1);
        // nodes.value = forceDirectedLayout(graphState.nodes, graphState.edges);
        // edges.value = graphState.edges;
        nodes.value = generateClusterNodes(1, 15)
        edges.value = generateRandomEdges(nodes.value, 10, 0.8, 4, 1);
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