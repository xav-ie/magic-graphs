/*
  This file contains helper functions for hit boxes on the canvas.
*/

type Circle = {
  x: number,
  y: number,
  radius: number,
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