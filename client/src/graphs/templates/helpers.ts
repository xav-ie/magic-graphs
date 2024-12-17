import type { GNode } from "@graph/types";
import type { BoundingBox, Coordinate } from "@shape/types";

export const getAverageCoordinatesOfGraphNodes = (nodes: GNode[]): Coordinate => {
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

export const getGraphNodesBoundingBox = (nodes: GNode[]): BoundingBox => {
  if (nodes.length === 0) {
    return {
      at: { x: 0, y: 0 },
      width: 0,
      height: 0
    };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const node of nodes) {
    if (node.x < minX) minX = node.x;
    if (node.y < minY) minY = node.y;
    if (node.x > maxX) maxX = node.x;
    if (node.y > maxY) maxY = node.y;
  }

  const topLeft = { x: minX, y: minY };
  const width = maxX - minX;
  const height = maxY - minY;

  return {
    at: topLeft,
    width,
    height
  }
}

export const centerNodesOnOriginCoordinates = (
  nodes: GNode[],
  targetOrigin: Coordinate
): GNode[] => {
  const centerOfMass = getAverageCoordinatesOfGraphNodes(nodes);

  const offsetX = targetOrigin.x - centerOfMass.x;
  const offsetY = targetOrigin.y - centerOfMass.y;

  return nodes.map(node => ({
    ...node,
    x: node.x + offsetX,
    y: node.y + offsetY
  }));
};