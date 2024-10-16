/*
  This file contains helper functions for drawing shapes on the canvas.
*/
import { getAngle } from "./helpers";
import {
  LINE_DEFAULTS,
  TEXT_DEFAULTS,
  TEXTAREA_DEFAULTS,
  type Line,
} from "./types"
import { drawCircleWithCtx } from "./draw/circle";
import { drawSquareWithCtx } from "./draw/square";
import { drawLineWithCtx } from "./draw/line";
import { drawTriangleWithCtx } from "./draw/triangle";
import { drawArrowWithCtx } from "./draw/arrow";
import { drawUTurnArrowWithCtx } from "./draw/uturn";

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
    start,
    end,
    textArea,
    textOffsetFromCenter
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

  const theta = getAngle(start, end);

  const offsetX = textOffsetFromCenter * Math.cos(theta);
  const offsetY = textOffsetFromCenter * Math.sin(theta);

  const textX = (start.x + end.x) / 2 + offsetX;
  const textY = (start.y + end.y) / 2 + offsetY;

  // background matte for text
  drawSquareWithCtx(ctx)({
    at: { x: textX - fontSize, y: textY - fontSize },
    width: fontSize * 2,
    height: fontSize * 2,
    color: bgColor,
  })

  // text
  ctx.font = `${fontWeight} ${fontSize}px Arial`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(content, textX, textY);
}