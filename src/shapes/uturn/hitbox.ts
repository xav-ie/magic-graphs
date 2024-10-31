import { rotatePoint } from "@shape/helpers";
import type { Coordinate } from "@shape/types";
import { lineHitbox } from "@shape/line/hitbox";
import type { UTurn } from ".";

export const uturnHitbox = (uturn: UTurn) => {
  const {
    spacing,
    center,
    upDistance,
    lineWidth,
    angle
  } = uturn;

  const end = rotatePoint({
    x: center.x + upDistance,
    y: center.y
  }, center, angle)

  const isInLine = lineHitbox({
    start: center,
    end,
    width: 2 * spacing + lineWidth
  })

  return (point: Coordinate) => isInLine(point);
}