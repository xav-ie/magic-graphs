import type { Coordinate, BoundingBox } from "@shape/types";
import type { Triangle } from ".";
import { rectEfficientHitbox } from "@shape/rect/hitbox";

/**
 * uses barycentric coordinate system for triangles. dont ask me, im not that smart.
 * https://en.wikipedia.org/wiki/Barycentric_coordinate_system
 *
  @param {Coordinate} point - the point to check if it is in the triangle
  @returns a function that checks if the point is in the triangle
*/
export const triangleHitbox = (triangle: Triangle) => (point: Coordinate) => {

  const {
    point1: a,
    point2: b,
    point3: c
  } = triangle;

  const { x, y } = point;

  const area = 0.5 * (-b.y * c.x + a.y * (-b.x + c.x) + a.x * (b.y - c.y) + b.x * c.y);
  const s = 1 / (2 * area) * (a.y * c.x - a.x * c.y + (c.y - a.y) * x + (a.x - c.x) * y);
  const t = 1 / (2 * area) * (a.x * b.y - a.y * b.x + (a.y - b.y) * x + (b.x - a.x) * y);

  return s > 0 && t > 0 && 1 - s - t > 0;
}

export const triangleEfficientHitbox = (triangle: Triangle) => {
  const {
    point1: a,
    point2: b,
    point3: c
  } = triangle;

  const minX = Math.min(a.x, b.x, c.x)
  const minY = Math.min(a.y, b.y, c.y)
  const width = Math.max(a.x, b.x, c.x) - minX
  const height = Math.max(a.y, b.y, c.y) - minY

  const isInRectEfficientHitbox = rectEfficientHitbox({
    at: { x: minX, y: minY },
    width,
    height
  })

  return (boxToCheck: BoundingBox) => isInRectEfficientHitbox(boxToCheck) 
}