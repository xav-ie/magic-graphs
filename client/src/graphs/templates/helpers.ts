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

export const centerNodesOnOriginCoordinates = <T extends Coordinate>(
  nodes: T[],
  targetOrigin: Coordinate
) => {
  const averageCoordinates = getAverageCoordinates(nodes);

  const offsetX = targetOrigin.x - averageCoordinates.x;
  const offsetY = targetOrigin.y - averageCoordinates.y;

  for (const node of nodes) {
    node.x += offsetX;
    node.y += offsetY;
  }

  return nodes;
};