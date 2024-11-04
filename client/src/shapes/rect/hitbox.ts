import type { Coordinate } from "@shape/types";
import type { Rect } from ".";
import { RECT_DEFAULTS } from "."

/**
 * @param point - the point to check if it is in the rectangle
 * @returns a function that checks if the point is in the rectangle with rounded corners
 */
export const rectHitbox = (rectangle: Rect) => (point: Coordinate) => {
  const { at, width, height, borderRadius } = { ...RECT_DEFAULTS, ...rectangle };
  const { x, y } = at;

  console.log(borderRadius)
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

  const isPointInCircle = (px: number, py: number, cx: number, cy: number, r: number) => {
    const dx = px - cx;
    const dy = py - cy;
    return dx * dx + dy * dy <= r * r;
  };

  return (
    isPointInCircle(point.x, point.y, x + radius, y + radius, radius) || 
    isPointInCircle(point.x, point.y, x + width - radius, y + radius, radius) || 
    isPointInCircle(point.x, point.y, x + radius, y + height - radius, radius) ||
    isPointInCircle(point.x, point.y, x + width - radius, y + height - radius, radius)
  );
  }
}