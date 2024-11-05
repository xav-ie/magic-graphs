import { rotatePoint } from "@shape/helpers";
import type { Coordinate } from "@shape/types";
import { lineHitbox } from "@shape/line/hitbox";
import type { UTurn } from ".";

export const uturnHitbox = (uturn: UTurn) => {
  const {
    spacing,
    at,
    upDistance,
    lineWidth,
    angle
  } = uturn;

  // rotated rectangle checked with line
  const end = rotatePoint({
    x: at.x + upDistance,
    y: at.y
  }, at, angle)

  const isInLine = lineHitbox({
    start: at,
    end,
    width: 2 * spacing + lineWidth
  })

  return (point: Coordinate) => isInLine(point);
}