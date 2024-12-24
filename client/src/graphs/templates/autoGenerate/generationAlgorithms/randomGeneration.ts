import { graphLabelGetter, LETTERS } from "@graph/labels";
import type { GEdge, GNode } from "@graph/types";
import { angleDifference } from "@shape/helpers";
import { generateId } from "@utils/id";
import { ref } from "vue";

/**
 * Generates an array of nodes distributed across multiple clusters.
 *
 * @param clusterCount - The number of clusters to generate.
 * @param maxNodesPerCluster - The number of nodes per cluster.
 * @param maxWidth - The maximum generation width.
 * @param maxHeight - The maximum generation height.
 * @param minDistance - The minimum distance between nodes in a cluster.
 * @param clusterSpread - The maximum radius for nodes in a cluster.
 * @returns An array of nodes distributed across multiple clusters.
 */
export const generateClusterNodes = (
  clusterCount: number = 1,
  maxNodesPerCluster: number = 10,
  maxWidth: number = 1250,
  maxHeight: number = 1250,
  minDistance: number = 200,
  clusterSpread: number = 300
): GNode[] => {
  const nodes = ref<GNode[]>([]);

  const minJump = 5; 
  const maxJump = 20

  const clusterCenters = Array.from({ length: clusterCount }, () => ({
    x: Math.random() * (maxWidth - clusterSpread * 2) + clusterSpread,
    y: Math.random() * (maxHeight - clusterSpread * 2) + clusterSpread,
  }));

  clusterCenters.forEach((center) => {
    const angleStep = (2 * Math.PI) / maxNodesPerCluster;

    const getLabel = graphLabelGetter(nodes, LETTERS);

    for (let i = 0; i < maxNodesPerCluster; i++) {
      const angle = angleStep * i * (Math.random() / 10 + 1); 
      let radius = minDistance; 
      let x: number, y: number;
      let retry = 0;
    
      do {
        radius += Math.random() * (maxJump - minJump) + minJump;
        x = center.x + Math.cos(angle) * radius;
        y = center.y + Math.sin(angle) * radius;
        retry++;
      } while (
        nodes.value.some(
          (node) => Math.hypot(node.x - x, node.y - y) < minDistance
        ) &&
        retry < 50
      );
    
      nodes.value.push({
        id: generateId(),
        label: getLabel(),
        x: Math.min(Math.max(x, 0), maxWidth),
        y: Math.min(Math.max(y, 0), maxHeight),
      });
    }
  });

  return nodes.value;
};

/**
 * Generates random edges for a list of nodes.
 * 
 * @param nodes list of nodes
 * @param maxEdgesPerNode maximum number of edges per node
 * @param connectionProbability probability of creating an edge between two nodes
 * @param maxNeighbors maximum number of neighbors for each node
 * @param minAngleBetweenEdges minimum allowable angle (in degrees) between edges
 * @returns list of edges between `nodes`
 */
export const generateRandomEdges = (
  nodes: GNode[],
  maxEdgesPerNode: number,
  connectionProbability: number,
  maxNeighbors: number,
  minAngleBetweenEdges: number
): GEdge[] => {
  const edges: GEdge[] = [];

  const edgeCounts: Record<string, number> = {};
  nodes.forEach((node) => (edgeCounts[node.id] = 0));

  const calculateAngle = (nodeA: GNode, nodeB: GNode, nodeC: GNode): number => {
    const vector1 = { x: nodeB.x - nodeA.x, y: nodeB.y - nodeA.y };
    const vector2 = { x: nodeC.x - nodeA.x, y: nodeC.y - nodeA.y };

    const angle1 = Math.atan2(vector1.y, vector1.x);
    const angle2 = Math.atan2(vector2.y, vector2.x);

    return angleDifference(angle1, angle2) * (180 / Math.PI);
  }

  const isEdgeValid = (
    sourceNode: GNode,
    targetNode: GNode,
    existingEdges: GEdge[]
  ) => {
    for (const edge of existingEdges) {
      if (edge.from === sourceNode.id || edge.to === sourceNode.id) {
        const otherNode = nodes.find(
          (node) =>
            node.id === (edge.from === sourceNode.id ? edge.to : edge.from)
        )!;
        const angle = calculateAngle(sourceNode, targetNode, otherNode);

        if (angle < minAngleBetweenEdges) {
          return false;
        }
      }
    }
    return true;
  }

  const getNearestNeighbors = (node: GNode, allNodes: GNode[]) => {
    return allNodes
      .filter((otherNode) => otherNode.id !== node.id)
      .map((otherNode) => ({
        node: otherNode,
        distance: Math.hypot(node.x - otherNode.x, node.y - otherNode.y),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, maxNeighbors)
      .map((entry) => entry.node);
  }

  nodes.forEach((node) => {
    const nearestNeighbors = getNearestNeighbors(node, nodes);

    if (nearestNeighbors.length > 0) {
      const closestNeighbor = nearestNeighbors[0];

      if (
        edgeCounts[node.id] < maxEdgesPerNode &&
        edgeCounts[closestNeighbor.id] < maxEdgesPerNode
      ) {
        edges.push({
          id: generateId(),
          from: node.id,
          to: closestNeighbor.id,
          label: "1",
        });
        edgeCounts[node.id]++;
        edgeCounts[closestNeighbor.id]++;
      }
    }

    for (let i = 1; i < nearestNeighbors.length; i++) {
      const neighbor = nearestNeighbors[i];

      if (
        edgeCounts[node.id] >= maxEdgesPerNode ||
        edgeCounts[neighbor.id] >= maxEdgesPerNode
      ) {
        continue;
      }

      if (
        Math.random() <= connectionProbability &&
        isEdgeValid(node, neighbor, edges)
      ) {
        edges.push({
          id: generateId(),
          from: node.id,
          to: neighbor.id,
          label: "1",
        });
        edgeCounts[node.id]++;
        edgeCounts[neighbor.id]++;
      }
    }
  });

  return edges;
}
