import type { Coordinate } from "@shape/types"
import type { Circle } from "@shape/circle"
import { STROKE_DEFAULTS } from "@shape/types"

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