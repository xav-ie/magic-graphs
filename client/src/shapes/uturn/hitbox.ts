import { rotatePoint } from "@shape/helpers";
import type { Coordinate, BoundingBox } from "@shape/types";
import { lineHitbox } from "@shape/line/hitbox";
import type { UTurn } from ".";
import { rectEfficientHitbox } from "@shape/rect/hitbox";
import { arrowHitbox } from "@shape/arrow/hitbox";
import { circleHitbox } from "@shape/circle/hitbox";


export const uturnHitbox = (uturn: UTurn) => {
  const {
    spacing,
    at,
    downDistance,
    upDistance,
    lineWidth,
    rotation
  } = uturn;

  const longLegFrom = rotatePoint({
    x: at.x,
    y: at.y - spacing
  }, at, rotation);

  const longLegTo = rotatePoint({
    x: at.x + upDistance,
    y: at.y - spacing
  }, at, rotation);

  const shortLegFrom = rotatePoint({
    x: at.x + upDistance,
    y: at.y + spacing
  }, at, rotation);

  const shortLegTo = rotatePoint({
    x: at.x + upDistance - downDistance,
    y: at.y + spacing
  }, at, rotation);

  const arcAt = rotatePoint({
    x: at.x + upDistance,
    y: at.y
  }, at, rotation);

  const isInLine = lineHitbox({ start: longLegFrom, end: longLegTo, width: lineWidth });
  const isInArrow = arrowHitbox({ start: shortLegFrom, end: shortLegTo, width: lineWidth });
  const isInUTurn = circleHitbox({ at: arcAt, radius: spacing + lineWidth / 2 });

  return (point: Coordinate) => isInLine(point) || isInArrow(point) || isInUTurn(point);
}

export const getUturnBoundingBox = (uturn: UTurn) => () => {
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

  const minX = Math.min(at.x, end.x) - lineWidth / 2 - spacing
  const minY = Math.min(at.y, end.y) - lineWidth / 2 - spacing
  const maxX = Math.max(at.x, end.x) + lineWidth / 2 + spacing
  const maxY = Math.max(at.y, end.y) + lineWidth / 2 + spacing

  return {
    topLeft: { x: minX , y: minY  },
    bottomRight: { x: maxX , y: maxY  }
  }
}

export const uturnEfficientHitbox = (uturn: UTurn) => {


  const { topLeft, bottomRight } = getUturnBoundingBox(uturn)();

  const hitboxWidth = bottomRight.x - topLeft.x;
  const hitboxHeight = bottomRight.y - topLeft.y;

  const isInRectEfficientHitbox = rectEfficientHitbox({
    at: {
      x: topLeft.x,
      y: topLeft.y
    },
    width: hitboxWidth, 
    height: hitboxHeight
  });

  return (boxToCheck: BoundingBox) => isInRectEfficientHitbox(boxToCheck);
}
