import type { Coordinate, BoundingBox } from "@shape/types";
import { LINE_DEFAULTS } from ".";
import type { Line } from ".";
import { rectEfficientHitbox } from "@shape/rect/hitbox";


/**
 * @param point - the point to check if it is in the line
 * @returns a function that checks if the point is in the line
*/
export const lineHitbox = (line: Line) => (point: Coordinate) => {
  const {
    start,
    end,
    width
  } = {
    ...LINE_DEFAULTS,
    ...line
  };

  const { x: x1, y: y1 } = start;
  const { x: x2, y: y2 } = end;
  const { x, y } = point;

  const lineLengthSquared = (x2 - x1) ** 2 + (y2 - y1) ** 2;

  if (lineLengthSquared === 0) {
    const distanceSquared = (x - x1) ** 2 + (y - y1) ** 2;
    return distanceSquared <= (width / 2) ** 2;
  }

  const projectionDistance = ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / lineLengthSquared;

  const clampedProjectionDistance = Math.max(0, Math.min(1, projectionDistance));

  const closestX = x1 + clampedProjectionDistance * (x2 - x1);
  const closestY = y1 + clampedProjectionDistance * (y2 - y1);

  const distanceSquared = (x - closestX) ** 2 + (y - closestY) ** 2;

  return distanceSquared <= (width / 2) ** 2;
};

export const lineEfficientHitbox = (line: Line) => {
  const {
    start,
    end
  } = line

  const minX = Math.min(start.x, end.x)
  const minY = Math.min(start.y, end.y)
  const width = Math.abs(start.x - end.x)
  const height = Math.abs(start.y - end.y)

  const isInRectEfficientHitbox = rectEfficientHitbox({
    at: { x: minX, y: minY },
    width,
    height
  })

  return (boxToCheck: BoundingBox) => isInRectEfficientHitbox(boxToCheck)
}