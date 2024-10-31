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
import { getTextAreaDimension, getTextAreaLocation } from "@shape/text"

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