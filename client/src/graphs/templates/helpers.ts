import type { GNode } from "@graph/types";
import type { Coordinate } from "@shape/types";

export const getAverageCoordinatesOfGraphNodes = (nodes: GNode[]) => {
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

export const generateTemplateFromOriginCoordinates = (
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