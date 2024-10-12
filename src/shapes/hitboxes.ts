/*
  This file contains helper functions for hit boxes on the canvas.
*/
import type { Coordinate, Circle, Line, Square } from "./types"

export const hitboxes = (point: Coordinate) => ({
  isInCircle: isInCircle(point),
  isInLine: isInLine(point),
  isInSquare: isInSquare(point),
})

export const isInCircle = (point: Coordinate) => (circle: Circle) => {
  const dx = point.x - circle.at.x;
  const dy = point.y - circle.at.y;
  return dx * dx + dy * dy <= circle.radius * circle.radius;
}

export const isInSquare = (point: Coordinate) => (square: Square) => {
  const { at, width, height } = square;
  const { x, y } = at;
  return point.x >= x && point.x <= x + width && point.y >= y && point.y <= y + height;
}

export const isInLine = (point: Coordinate) => (line: Line) => {
  const { start, end, width } = line;
  const { x: x1, y: y1 } = start;
  const { x: x2, y: y2 } = end;
  const { x, y } = point;

  const distance = Math.abs(
    (y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1
  ) / Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);

  return distance <= width / 2;
}