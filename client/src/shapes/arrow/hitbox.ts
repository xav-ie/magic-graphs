import type { Coordinate, BoundingBox } from "@shape/types";
import { lineHitbox, lineEfficientHitbox, getLineBoundingBox } from "@shape/line/hitbox";
import type { Arrow } from ".";
import { triangleHitbox } from "@shape/triangle/hitbox";
import { calculateArrowHeadCorners } from "@shape/helpers";

export const arrowHitbox = (arrow: Arrow) => {
  const isInLine = lineHitbox(arrow);

  const arrowHeadTriangle = calculateArrowHeadCorners(arrow);
  const isInArrowHead = triangleHitbox(arrowHeadTriangle);

  return (point: Coordinate) => isInLine(point) || isInArrowHead(point)
}

export const getArrowBoundingBox = (arrow: Arrow) => {
  return getLineBoundingBox(arrow)
};

export const arrowEfficientHitbox = (arrow: Arrow) => {
  const isInLineEfficientHitbox = lineEfficientHitbox(arrow)
  return (boxToCheck: BoundingBox) => isInLineEfficientHitbox(boxToCheck)
}
