import { CROSS_DEFAULTS } from ".";
import type { Cross } from ".";
import { lineHitbox } from "@shape/line/hitbox";
import type { Coordinate } from "@shape/types";
import { rotatePoint } from "@shape/helpers";

/**
 * @param point - the point to check if it is in the cross
 * @returns a function that checks if the point is in the cross
*/
export const crossHitbox = (cross: Cross) => {
  const {
    center,
    size,
    angle,
    lineWidth,
  } = {
    ...CROSS_DEFAULTS,
    ...cross
  }

// TODO: convert these to rectangles once rectangles support rotation
  const points = [
    { x: center.x - size / 2, y: center.y },
    { x: center.x + size / 2, y: center.y },
    { x: center.x, y: center.y - size / 2 },
    { x: center.x, y: center.y + size / 2 },
  ].map(point => rotatePoint(point, center, angle))

  const horizontalLine = lineHitbox({
    start: points[0],
    end: points[1],
    width: lineWidth,
  })

  const verticalLine = lineHitbox({
    start: points[2],
    end: points[3],
    width: lineWidth,
  })


  return (point: Coordinate) => horizontalLine(point) || verticalLine(point);
}