import type { Coordinate, BoundingBox } from "@shape/types";
import type { Square } from ".";
import { rectHitbox, rectEfficientHitbox } from "@shape/rect/hitbox";

/**
 * @param point - the point to check if it is in the square
 * @returns a function that checks if the point is in the square
*/
export const squareHitbox = (square: Square) => {
  const isInRect = rectHitbox({
    at: square.at,
    width: square.size,
    height: square.size,
    borderRadius: square.borderRadius,
    rotation: square.rotation,
  });
  return (point: Coordinate) => isInRect(point);
}

export const squareEfficientHitbox = (square: Square) => {
  const isInRectEfficientHitbox = rectEfficientHitbox({
    at: square.at,
    width: square.size,
    height: square.size,
  })

  return (boxToCheck: BoundingBox) => isInRectEfficientHitbox(boxToCheck)
}