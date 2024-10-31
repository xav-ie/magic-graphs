import { TEXT_DEFAULTS, TEXTAREA_DEFAULTS } from "@shape/types";
import type { Coordinate } from "@shape/types";
import { rectHitbox } from "@shape/rect/hitbox";
import { getTextAreaDimension, getTextAreaLocation } from "@shape/text";
import { LINE_DEFAULTS } from ".";
import type { Line } from ".";

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