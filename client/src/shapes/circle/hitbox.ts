import type { Coordinate, BoundingBox } from "@shape/types"
import type { Circle } from "@shape/circle"
import { STROKE_DEFAULTS } from "@shape/types"
import { rectEfficientHitbox } from "@shape/rect/hitbox";

export const circleHitbox = (circle: Circle) => (point: Coordinate) => {
  const dx = point.x - circle.at.x;
  const dy = point.y - circle.at.y;

  const stroke = {
    ...STROKE_DEFAULTS,
    ...circle.stroke
  }

  const radiusWithStroke = circle.radius + (stroke.width / 2);

  return dx ** 2 + dy ** 2 <= radiusWithStroke ** 2;
}

export const circleEfficientHitbox = (circle: Circle) => {
  const {
    at,
    radius,
  } = circle

  const { width: borderWidth } = {
    ...STROKE_DEFAULTS,
    ...circle.stroke
  }

  const isInRectEfficientHitbox = rectEfficientHitbox({
    at: {
      x: at.x - (radius + (borderWidth / 2)),
      y: at.y - (radius + (borderWidth / 2))
    },
    width: 2 * radius + borderWidth,
    height: 2 * radius + borderWidth
  })

  return (boxToCheck: BoundingBox) => isInRectEfficientHitbox(boxToCheck)
}