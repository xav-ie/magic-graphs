import type { Coordinate, BoundingBox } from "@shape/types";
import {
  lineHitbox,
  lineEfficientHitbox,
  getLineBoundingBox,
} from "@shape/line/hitbox";
import type { Arrow } from ".";
import { triangleEfficientHitbox, triangleHitbox } from "@shape/triangle/hitbox";
import { calculateArrowHeadCorners } from "@shape/helpers";

export const arrowHitbox = (arrow: Arrow) => {
  const isInLine = lineHitbox(arrow);

  const arrowHeadTriangle = calculateArrowHeadCorners(arrow);
  const isInArrowHead = triangleHitbox(arrowHeadTriangle);

  return (point: Coordinate) => isInLine(point) || isInArrowHead(point);
};

export const getArrowBoundingBox = (arrow: Arrow) => () => {
  const { 
    topLeft: lineTopLeft, 
    bottomRight: lineBottomRight 
  } = getLineBoundingBox(arrow)();
  const arrowHeadTriangle = calculateArrowHeadCorners(arrow);

  const minX = Math.min(
    lineTopLeft.x,
    arrowHeadTriangle.point1.x,
    arrowHeadTriangle.point2.x,
    arrowHeadTriangle.point3.x
  );
  const maxX = Math.max(
    lineTopLeft.x,
    arrowHeadTriangle.point1.x,
    arrowHeadTriangle.point2.x,
    arrowHeadTriangle.point3.x
  );
  const minY = Math.min(
    lineBottomRight.y,
    arrowHeadTriangle.point1.y,
    arrowHeadTriangle.point2.y,
    arrowHeadTriangle.point3.y
  );
  const maxY = Math.max(
    lineBottomRight.y,
    arrowHeadTriangle.point1.y,
    arrowHeadTriangle.point2.y,
    arrowHeadTriangle.point3.y
  );

  return {
    topLeft: { x: minX, y: minY },
    bottomRight: { x: maxX, y: maxY },
  }
};

export const arrowEfficientHitbox = (arrow: Arrow) => {
  const isInLineEfficientHitbox = lineEfficientHitbox(arrow);
  const arrowHeadTriangle = calculateArrowHeadCorners(arrow);
  const isInArrowHeadEfficientHitbox = triangleEfficientHitbox(arrowHeadTriangle);
  return (boxToCheck: BoundingBox) => isInLineEfficientHitbox(boxToCheck) || isInArrowHeadEfficientHitbox(boxToCheck);
};
