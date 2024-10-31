import type { Coordinate } from "@shape/types"
import type { Circle } from "@shape/circle"

export const circleHitbox = (circle: Circle) => (point: Coordinate) => {
  const dx = point.x - circle.at.x;
  const dy = point.y - circle.at.y;
  return dx * dx + dy * dy <= circle.radius * circle.radius;
}