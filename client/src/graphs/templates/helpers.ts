import type { Coordinate } from "@shape/types";
import { average } from "@utils/math";

export const getAverageCoordinates = (coords: Coordinate[]) => {
  const x = coords.map(coord => coord.x);
  const y = coords.map(coord => coord.y);
  return {
    x: average(x),
    y: average(y),
  }
};

export const centerNodesOnOriginCoordinates = (
  nodes: Coordinate[],
  targetOrigin: Coordinate
): Coordinate[] => {
  const averageCoordinates = getAverageCoordinates(nodes);

  const offsetX = targetOrigin.x - averageCoordinates.x;
  const offsetY = targetOrigin.y - averageCoordinates.y;

  return nodes.map(node => ({
    ...node,
    x: node.x + offsetX,
    y: node.y + offsetY
  }));
};