/*
  This file contains helper functions for drawing shapes on the canvas.
*/
import { getAngle, rotatePoint } from "./helpers";
import {
  TEXT_DEFAULTS,
  type Circle,
  type Line,
  type Square,
  type Triangle,
  type UTurnArrow
} from "./types"
import { drawCircleWithCtx } from "./draw/circle";
import { drawSquareWithCtx } from "./draw/square";

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
  if (!line.text) return;

  const {
    start,
    end,
    text
  } = line;

  const {
    content,
    fontSize,
    fontWeight,
    color,
    offsetFromCenter,
    bgColor,
  } = {
    ...LINE_TEXT_DEFAULTS,
    ...text
  }

  const theta = getAngle(start, end);

  const offsetX = offsetFromCenter * Math.cos(theta);
  const offsetY = offsetFromCenter * Math.sin(theta);

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