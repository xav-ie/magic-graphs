/*
  This file contains helper functions for drawing shapes on the canvas.
*/
import type { Line, Arrow } from "@shape/types"
import { drawSquareWithCtx } from "@shape/draw/square";
import { drawLineWithCtx } from "@shape/draw/line";
import { drawTriangleWithCtx } from "@shape/draw/triangle";
import { drawArrowWithCtx } from "@shape/draw/arrow";
import { drawUTurnArrowWithCtx } from "@shape/draw/uturn";

/**
 * @description parent function that returns all the draw functions for the shapes
 *
 * @param {CanvasRenderingContext2D} ctx - the canvas context to draw the shapes on
 * @returns an object that aggregates all the draw functions to draw a shape on the canvas
 */
export const drawShape = (ctx: CanvasRenderingContext2D) => ({
  drawLine: drawLineWithCtx(ctx),
  drawSquare: drawSquareWithCtx(ctx),
  drawRectangle: drawSquareWithCtx(ctx),
  drawTriangle: drawTriangleWithCtx(ctx),
  drawArrow: drawArrowWithCtx(ctx),
  drawUTurnArrow: drawUTurnArrowWithCtx(ctx),
})