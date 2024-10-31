/**
  This file contains helper functions for hit boxes on the canvas.
  */

import {
  TEXT_DEFAULTS,
  LINE_DEFAULTS,
  TEXTAREA_DEFAULTS
} from "@shape/types"
import type {
  Coordinate,
  Circle,
  Line,
  Square,
  Triangle,
  UTurnArrow,
  Rectangle,
  Arrow
} from "@shape/types"
import { rotatePoint } from "@shape/helpers"
import { getTextAreaDimension, getTextAreaLocation } from "@shape/draw/text"

/**
 * @param point - the point to check if it is in the shape
 * @returns an object that aggregates all the hitbox functions to check if the point is in a given shape
 */
export const hitboxes = (point: Coordinate) => ({
  isInCircle: isInCircle(point),
  isInLine: isInLine(point),
  isInSquare: isInSquare(point),
  isInRectangle: isInRectangle(point),
  isInTriangle: isInTriangle(point),
  isInArrow: isInLine(point),
  isInUTurnArrow: isInUTurnArrow(point),
})

export const isInTextarea = (point: Coordinate) => ({
  line: isInLineTextArea(point),
  arrow: isInArrowTextArea(point),
  uTurn: isInUTurnArrowTextArea(point),
})

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

export const isInUTurnArrowTextArea = (point: Coordinate) => (uTurn: UTurnArrow) => {
  if (!uTurn.textArea) return false;
  const textArea = { ...TEXTAREA_DEFAULTS, ...uTurn.textArea };
  const text = { ...TEXT_DEFAULTS, ...textArea.text };
  const fullTextArea = {
    ...textArea,
    text,
    at: getTextAreaLocation.uTurn(uTurn),
  }

  const { width, height } = getTextAreaDimension(fullTextArea);

  return isInSquare(point)({
    at: fullTextArea.at,
    width,
    height
  });
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