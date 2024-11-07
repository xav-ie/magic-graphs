import { CROSS_DEFAULTS } from ".";
import type { Cross } from ".";
import { rectHitbox, rectEfficientHitbox } from "@shape/rect/hitbox";
import type { Coordinate, BoundingBox } from "@shape/types";

/**
 * @param point - the point to check if it is in the cross
 * @returns a function that checks if the point is in the cross
 */
export const crossHitbox = (cross: Cross) => {
  const {
    at,
    size,
    rotation,
    lineWidth,
    borderRadius,
  } = {
    ...CROSS_DEFAULTS,
    ...cross
  };

  const halfLineWidth = lineWidth / 2;

  const horizontalHitbox = rectHitbox({
    at: { x: at.x - size / 2, y: at.y - halfLineWidth },
    width: size,
    height: lineWidth,
    rotation,
    borderRadius,
  });
  const verticalHitbox = rectHitbox({
    at: { x: at.x - halfLineWidth, y: at.y - size / 2 },
    width: lineWidth,
    height: size,
    rotation,
    borderRadius,
  });

  return (point: Coordinate) => horizontalHitbox(point) || verticalHitbox(point);
};

export const crossEfficientHitbox = (cross: Cross) => {

  const {
    at,
    size
  } = cross

  const isInRectEfficientHitbox = rectEfficientHitbox({
    at: { x: at.x - size, y: at.y - size },
    width: 2 * size,
    height: 2 * size
  })
  return (boxToCheck: BoundingBox) => isInRectEfficientHitbox(boxToCheck)
}