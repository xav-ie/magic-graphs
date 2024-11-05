import { CROSS_DEFAULTS } from ".";
import type { Cross } from ".";
import { rectHitbox } from "@shape/rect/hitbox";
import type { Coordinate } from "@shape/types";

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
    borderRadius,
  } = {
    ...CROSS_DEFAULTS,
    ...cross
  };

  const halfLineWidth = lineWidth / 2;

  const horizontalHitbox = rectHitbox({
    at: { x: center.x - size / 2, y: center.y - halfLineWidth },
    width: size,
    height: lineWidth,
    rotation: angle,
    borderRadius,
  });
  const verticalHitbox = rectHitbox({
    at: { x: center.x - halfLineWidth, y: center.y - size / 2 },
    width: lineWidth,
    height: size,
    rotation: angle,
    borderRadius,
  });

  return (point: Coordinate) => horizontalHitbox(point) || verticalHitbox(point);
};
