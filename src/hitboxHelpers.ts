/*
  This file contains helper functions for hit boxes on the canvas.
*/

type Circle = {
  x: number,
  y: number,
  radius: number,
}

type Line = {
  start: Coordinate,
  end: Coordinate,
  width: number,
}

type Coordinate = {
  x: number,
  y: number,
}

export const isInCircle = (point: Coordinate, circle: Circle) => {
  const dx = point.x - circle.x;
  const dy = point.y - circle.y;
  return dx * dx + dy * dy <= circle.radius * circle.radius;
}

export const isInLine = (point: Coordinate, line: Line) => {
  const { start, end, width } = line;
  const { x: x1, y: y1 } = start;
  const { x: x2, y: y2 } = end;
  const { x, y } = point;

  const distance = Math.abs(
    (y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1
  ) / Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);

  return distance <= width / 2;
}