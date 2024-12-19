import type { GNode } from "@graph/types";
import type { Coordinate } from "@shape/types";

export const getAverageCoordinatesOfNodes = (nodes: GNode[]) => {
  if (nodes.length === 0) {
    return { x: 0, y: 0 };
  }

  const total = nodes.reduce((acc, node) => {
    acc.x += node.x;
    acc.y += node.y;
    return acc;
  }, { x: 0, y: 0 });

  const nodeCount = nodes.length;
  return {
    x: total.x / nodeCount,
    y: total.y / nodeCount
  };
};

export const centerNodesOnOriginCoordinates = (
  nodes: GNode[],
  targetOrigin: Coordinate
): GNode[] => {
  const averageCoordinates = getAverageCoordinatesOfNodes(nodes);

  const offsetX = targetOrigin.x - averageCoordinates.x;
  const offsetY = targetOrigin.y - averageCoordinates.y;

  return nodes.map(node => ({
    ...node,
    x: node.x + offsetX,
    y: node.y + offsetY
  }));
};