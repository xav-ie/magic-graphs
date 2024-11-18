import type { Coordinate, BoundingBox } from "@shape/types";
import { lineHitbox, lineEfficientHitbox, getLineBoundingBox } from "@shape/line/hitbox";
import type { Arrow } from ".";

/**
 * TODO - Check arrow tips!
 */
export const arrowHitbox = (arrow: Arrow) => {
  const isInLine = lineHitbox(arrow);
  return (point: Coordinate) => isInLine(point);
}

export const getArrowBoundingBox = (arrow: Arrow) => {
  return getLineBoundingBox(arrow)
};

export const arrowEfficientHitbox = (arrow: Arrow) => {
  const isInLineEfficientHitbox = lineEfficientHitbox(arrow)
  return (boxToCheck: BoundingBox) => isInLineEfficientHitbox(boxToCheck)
}
