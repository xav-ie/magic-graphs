import type { Coordinate } from "@shape/types";
import type { Rect } from ".";

/**
 * @param point - the point to check if it is in the rectangle
 * @returns a function that checks if the point is in the rectangle
*/
export const rectHitbox = (rectangle: Rect) => (point: Coordinate) => {
  const { at, width, height } = rectangle;
  const { x, y } = at;
  return point.x >= x && point.x <= x + width && point.y >= y && point.y <= y + height;
}