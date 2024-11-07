import { rotatePoint } from "@shape/helpers";
import type { Coordinate, BoundingBox } from "@shape/types";
import { lineHitbox } from "@shape/line/hitbox";
import type { UTurn } from ".";
import { rectEfficientHitbox } from "@shape/rect/hitbox";


export const uturnHitbox = (uturn: UTurn) => {
  const {
    spacing,
    at,
    upDistance,
    lineWidth,
    rotation
  } = uturn;

  // rotated rectangle checked with line
  const end = rotatePoint({
    x: at.x + upDistance,
    y: at.y
  }, at, rotation)

  const isInLine = lineHitbox({
    start: at,
    end,
    width: 2 * spacing + lineWidth
  })

  return (point: Coordinate) => isInLine(point);
}

export const uturnEfficientHitbox = (uturn: UTurn) => {
  const {
    spacing,
    at,
    upDistance,
    rotation,
    lineWidth
  } = uturn

  const end = rotatePoint({
    x: at.x + upDistance,
    y: at.y
  }, at, rotation)

  const minX = Math.min(at.x, end.x)
  const minY = Math.min(at.y, end.y)
  const hitboxWidth = Math.abs(at.x - end.x)
  const hitboxHeight = Math.abs(at.y - end.y)

  const isInRectEfficientHitbox = rectEfficientHitbox({
    at: {
      x: minX - lineWidth / 2 - spacing,
      y: minY - lineWidth / 2 - spacing
    },
    width: hitboxWidth + lineWidth + 2 * spacing,
    height: hitboxHeight + lineWidth + 2 * spacing
  })

  return (boxToCheck: BoundingBox) => isInRectEfficientHitbox(boxToCheck)
}