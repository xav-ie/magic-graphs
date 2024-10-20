/*
  This file contains helper functions for drawing shapes on the canvas.
*/
import type { Line, Arrow } from "./types"
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