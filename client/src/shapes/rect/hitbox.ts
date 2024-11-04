import type { Coordinate } from "@shape/types";
import type { Rect } from ".";
import { RECT_DEFAULTS } from "."
import { circleHitbox } from "@shape/circle/hitbox";

/**
 * @param point - the point to check if it is in the rectangle
 * @returns a function that checks if the point is in the rectangle with rounded corners
 */
export const rectHitbox = (rectangle: Rect) => (point: Coordinate) => {
  const { at, width, height, borderRadius } = { ...RECT_DEFAULTS, ...rectangle };
  const { x, y } = at;

  if (borderRadius === 0) return point.x >= x && point.x <= x + width && point.y >= y && point.y <= y + height;
  else {
    const radius = Math.min(borderRadius, width / 2, height / 2);

  if (
    point.x >= x + radius &&
    point.x <= x + width - radius &&
    point.y >= y &&
    point.y <= y + height
  ) {
    return true;
  }

  if (
    point.x >= x &&
    point.x <= x + width &&
    point.y >= y + radius &&
    point.y <= y + height - radius
  ) {
    return true;
  }

  const isInTopLeftCircle = circleHitbox({ at: { x: x + radius, y: y + radius }, radius });
  const isInTopRightCircle = circleHitbox({ at: { x: x + width - radius, y: y + radius }, radius });
  const isInBottomLeftCircle = circleHitbox({ at: { x: x + radius, y: y + height - radius }, radius }); 
  const isInBottomRightCircle = circleHitbox({ at: { x: x + width - radius, y: y + height - radius }, radius });

  return isInTopLeftCircle(point) || isInTopRightCircle(point) || isInBottomLeftCircle(point) || isInBottomRightCircle(point);
  }
}