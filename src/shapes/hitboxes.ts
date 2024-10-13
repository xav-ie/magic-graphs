/*
  This file contains helper functions for hit boxes on the canvas.
*/
import type { Coordinate, Circle, Line, Square, Triangle } from "./types"

export const hitboxes = (point: Coordinate) => ({
  isInCircle: isInCircle(point),
  isInLine: isInLine(point),
  isInSquare: isInSquare(point),
  isInTriangle: isInTriangle(point),
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

/*
  uses barycentric coordinate system for triangles. dont ask me, im not that smart.
  https://en.wikipedia.org/wiki/Barycentric_coordinate_system
*/
export const isInTriangle = (point: Coordinate) => (triangle: Triangle) => {
  const {
    point1: a,
    point2: b,
    point3: c
  } = triangle;
  const { x, y } = point;

  const area = 0.5 * (-b.y * c.x + a.y * (-b.x + c.x) + a.x * (b.y - c.y) + b.x * c.y);
  const s = 1 / (2 * area) * (a.y * c.x - a.x * c.y + (c.y - a.y) * x + (a.x - c.x) * y);
  const t = 1 / (2 * area) * (a.x * b.y - a.y * b.x + (a.y - b.y) * x + (b.x - a.x) * y);

  return s > 0 && t > 0 && 1 - s - t > 0;
}