/**
  This file contains helper functions for hit boxes on the canvas.
*/
import type {
  Coordinate,
  Circle,
  Line,
  Square,
  Triangle,
  UTurnArrow,
  Rectangle,
  Arrow
} from "./types"
import { TEXT_DEFAULTS, LINE_DEFAULTS, TEXTAREA_DEFAULTS } from "./types"
import { rotatePoint } from "./helpers"
import { getTextAreaDimension, getTextAreaLocation } from "./draw/text"

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
  isInLineTextArea: isInLineTextArea(point),
  isInArrowTextArea: isInArrowTextArea(point),
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
  const { start, end, width } = {
    ...LINE_DEFAULTS,
    ...line
  };
  const { x: x1, y: y1 } = start;
  const { x: x2, y: y2 } = end;
  const { x, y } = point;

  const lineLengthSquared = (x2 - x1) ** 2 + (y2 - y1) ** 2;

  if (lineLengthSquared === 0) {
    const distanceSquared = (x - x1) ** 2 + (y - y1) ** 2;
    return distanceSquared <= (width / 2) ** 2;
  }

  const projectionDistance = ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / lineLengthSquared;

  const clampedProjectionDistance = Math.max(0, Math.min(1, projectionDistance));

  const closestX = x1 + clampedProjectionDistance * (x2 - x1);
  const closestY = y1 + clampedProjectionDistance * (y2 - y1);

  const distanceSquared = (x - closestX) ** 2 + (y - closestY) ** 2;

  return distanceSquared <= (width / 2) ** 2;
};


/**
 * @description checks if the point is in the text label of the line
 *
 * @param point - the point to check if it is in the line
 * @returns a function that checks if the point is in the line
 */
export const isInLineTextArea = (point: Coordinate) => (line: Line) => {
  if (!line.textArea) return false;
  const textArea = { ...TEXTAREA_DEFAULTS, ...line.textArea };
  const text = { ...TEXT_DEFAULTS, ...textArea.text };
  const fullTextArea = {
    ...textArea,
    text,
    at: getTextAreaLocation.line(line),
  }
  const { width, height } = getTextAreaDimension(fullTextArea);

  return isInSquare(point)({
    at: fullTextArea.at,
    width,
    height
  });
}

export const isInArrowTextArea = (point: Coordinate) => (arrow: Arrow) => {
  if (!arrow.textArea) return false;
  const textArea = { ...TEXTAREA_DEFAULTS, ...arrow.textArea };
  const text = { ...TEXT_DEFAULTS, ...textArea.text };
  const fullTextArea = {
    ...textArea,
    text,
    at: getTextAreaLocation.arrow(arrow),
  }
  const { width, height } = getTextAreaDimension(fullTextArea);

  return isInSquare(point)({
    at: fullTextArea.at,
    width,
    height
  });
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