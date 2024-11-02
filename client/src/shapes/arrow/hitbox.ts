import type { Coordinate } from "@shape/types";
import { lineHitbox } from "@shape/line/hitbox";
import type { Arrow } from ".";

/**
 * TODO - Check arrow tips!
 */
export const arrowHitbox = (arrow: Arrow) => {
  const isInLine = lineHitbox(arrow);
  return (point: Coordinate) => isInLine(point);
}