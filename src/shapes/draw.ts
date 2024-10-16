/*
  This file contains helper functions for drawing shapes on the canvas.
*/
import { getAngle } from "./helpers";
import {
  LINE_DEFAULTS,
  TEXT_DEFAULTS,
  TEXTAREA_DEFAULTS,
  type Line,
  type TextArea,
  type TextAreaWithLocation,
} from "./types"
import { drawCircleWithCtx } from "./draw/circle";
import { drawSquareWithCtx } from "./draw/square";
import { drawLineWithCtx } from "./draw/line";
import { drawTriangleWithCtx } from "./draw/triangle";
import { drawArrowWithCtx } from "./draw/arrow";
import { drawUTurnArrowWithCtx } from "./draw/uturn";

type LocationTextAreaGetter = Record<string, (shape: Line) => TextAreaWithLocation>
export const getLocationTextArea = (textArea: TextArea): LocationTextAreaGetter => ({
  line: (line: Line) => ({ ...textArea, at: getLocationTextAreaOnLine(line) }),
})

const getLocationTextAreaOnLine = (line: Line) => {
  const {
    textOffsetFromCenter,
    start,
    end,
  } = {
    ...LINE_DEFAULTS,
    ...line,
  }

  const theta = getAngle(start, end);

  const offsetX = textOffsetFromCenter * Math.cos(theta);
  const offsetY = textOffsetFromCenter * Math.sin(theta);

  const textX = (start.x + end.x) / 2 + offsetX;
  const textY = (start.y + end.y) / 2 + offsetY;

  return { x: textX, y: textY }
}

/**
 * @description parent function that returns all the draw functions for the shapes
 *
 * @param {CanvasRenderingContext2D} ctx - the canvas context to draw the shapes on
 * @returns an object that aggregates all the draw functions to draw a shape on the canvas
 */
export const drawShape = (ctx: CanvasRenderingContext2D) => ({
  drawCircle: drawCircleWithCtx(ctx),
  drawLine: drawLineWithCtx(ctx),
  drawSquare: drawSquareWithCtx(ctx),
  drawTriangle: drawTriangleWithCtx(ctx),
  drawArrow: drawArrowWithCtx(ctx),
  drawUTurnArrow: drawUTurnArrowWithCtx(ctx),
})

export const drawTextOnLineWithCtx = (ctx: CanvasRenderingContext2D) => (line: Line) => {

  const {
    textArea,
  } = {
    ...LINE_DEFAULTS,
    ...line,
  };

  if (!textArea) return;

  const {
    color: bgColor,
    text
  } = {
    ...TEXTAREA_DEFAULTS,
    ...textArea
  }

  const {
    content,
    fontSize,
    fontWeight,
    color,
  } = {
    ...TEXT_DEFAULTS,
    ...text
  }

  const { at: textAreaLocation } = getLocationTextArea(textArea).line(line);

  // background matte for text
  drawSquareWithCtx(ctx)({
    at: { x: textAreaLocation.x - fontSize, y: textAreaLocation.y - fontSize },
    width: fontSize * 2,
    height: fontSize * 2,
    color: bgColor,
  })

  // text
  ctx.font = `${fontWeight} ${fontSize}px Arial`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(content, textAreaLocation.x, textAreaLocation.y);
}