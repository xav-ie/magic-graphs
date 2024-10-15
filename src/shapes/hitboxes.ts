/*
  This file contains helper functions for hit boxes on the canvas.
*/
import type { Coordinate, Circle, Line, Square, Triangle, UTurnArrow, Rectangle } from "./types"
import { LINE_TEXT_DEFAULTS } from "./types"
import { rotatePoint, getAngle } from "./helpers"
import { drawShape } from "./draw"

/**
 * @param point - the point to check if it is in the shape
 * @returns an object that aggregates all the hitbox functions to check if the point is in a given shape
 */
export const hitboxes = (point: Coordinate) => ({
  isInCircle: isInCircle(point),
  isInLine: isInLine(point),
  isInSquare: isInSquare(point),
  isInTriangle: isInTriangle(point),
  isInArrow: isInLine(point),
  isInUTurnArrow: isInUTurnArrow(point),
  isInLineText: isInLineText(point),
})

/**
 * @param point - the point to check if it is in the circle
 * @returns a function that checks if the point is in the circle
 */
export const isInCircle = (point: Coordinate) => (circle: Circle) => {
  const dx = point.x - circle.at.x;
  const dy = point.y - circle.at.y;
  return dx * dx + dy * dy <= circle.radius * circle.radius;
}

/**
 * @param point - the point to check if it is in the square
 * @returns a function that checks if the point is in the square
*/
export const isInSquare = (point: Coordinate) => (square: Square) => {
  const { at, width, height } = square;
  const { x, y } = at;
  return point.x >= x && point.x <= x + width && point.y >= y && point.y <= y + height;
}

/**
 * @param point - the point to check if it is in the rectangle
 * @returns a function that checks if the point is in the rectangle
*/
export const isInRectangle = (point: Coordinate) => (rectangle: Rectangle) => {
  const { at, width, height } = rectangle;
  const { x, y } = at;
  return point.x >= x && point.x <= x + width && point.y >= y && point.y <= y + height;
}

/**
 * @param point - the point to check if it is in the line
 * @returns a function that checks if the point is in the line
*/
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

/**
 * @description checks if the point is in the text label of the line
 *
 * @param point - the point to check if it is in the line
 * @returns a function that checks if the point is in the line
 */
export const isInLineText = (point: Coordinate) => (line: Line) => {
  if (!line.text) return false;
  const {
    start,
    end,
    text,
    width
  } = line;

  const {
    fontSize,
    offsetFromCenter
  } = {
    ...LINE_TEXT_DEFAULTS,
    ...text
  };

  const theta = getAngle(start, end);

  const arrowHeadHeight = width * 2.5;
  const arrowShaftEnd = {
    x: end.x - arrowHeadHeight * Math.cos(theta),
    y: end.y - arrowHeadHeight * Math.sin(theta),
  }

  const offsetX = offsetFromCenter * Math.cos(theta);
  const offsetY = offsetFromCenter * Math.sin(theta);

  // if its an arrow use arrowShaftEnd, if its a line use end
  const textX = (start.x + arrowShaftEnd.x) / 2 + offsetX;
  const textY = (start.y + arrowShaftEnd.y) / 2 + offsetY;

  const textSquare = {
    at: { x: textX - fontSize, y: textY - fontSize },
    width: fontSize * 2,
    height: fontSize * 2,
  }

  return isInSquare(point)(textSquare);
}

/**
 * uses barycentric coordinate system for triangles. dont ask me, im not that smart.
 * https://en.wikipedia.org/wiki/Barycentric_coordinate_system
 *
  @param {Coordinate} point - the point to check if it is in the triangle
  @returns a function that checks if the point is in the triangle
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

export const isInUTurnArrow = (point: Coordinate) => (uTurnArrow: UTurnArrow) => {
  const {
    spacing,
    center,
    upDistance,
    lineWidth,
    angle
  } = uTurnArrow;

  return isInLine(point)({
    start: center,
    end: rotatePoint({ x: center.x + upDistance, y: center.y }, center, angle),
    width: 2 * spacing + lineWidth
  })
}