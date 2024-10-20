/*
  This file contains helper functions for drawing shapes on the canvas.
*/
import {
  TEXT_DEFAULTS,
  TEXTAREA_DEFAULTS,
  type Line,
  type Arrow,
  type TextArea,
  type Coordinate,
} from "./types"
import { drawCircleWithCtx } from "./draw/circle";
import { drawSquareWithCtx } from "./draw/square";
import { drawLineWithCtx, getTextAreaLocationOnLine } from "./draw/line";
import { drawTriangleWithCtx } from "./draw/triangle";
import { drawArrowWithCtx, getTextAreaLocationOnArrow } from "./draw/arrow";
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

// given a shape that supports the text area api, get back the full text area with the location
export const getTextAreaLocation = {
  line: (line: Line) =>  getTextAreaLocationOnLine(line),
  arrow: (arrow: Arrow) => getTextAreaLocationOnArrow(arrow)
}

export const drawTextAreaWithCtx = (ctx: CanvasRenderingContext2D) => ({
  line: (line: Line) => {
    if (!line.textArea) return;
    const textArea = {
      ...TEXTAREA_DEFAULTS,
      ...line.textArea,
    }
    const text = {
      ...TEXT_DEFAULTS,
      ...line.textArea.text,
    }
    const fullTextArea = {
      ...textArea,
      text,
      at: getTextAreaLocationOnLine(line),
    }
    drawTextAreaMatte(ctx)(fullTextArea);
    queueMicrotask(() => drawText(ctx)(fullTextArea));
  },
  arrow: (arrow: Arrow) => {
    if (!arrow.textArea) return;
    const textArea = {
      ...TEXTAREA_DEFAULTS,
      ...arrow.textArea,
    }
    const text = {
      ...TEXT_DEFAULTS,
      ...arrow.textArea.text,
    }
    const fullTextArea = {
      ...textArea,
      text,
      at: getTextAreaLocationOnArrow(arrow),
    }
    drawTextAreaMatte(ctx)(fullTextArea);
    queueMicrotask(() => drawText(ctx)(fullTextArea));
  },
})

export type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends object
    ? DeepRequired<T[K]>
    : T[K];
};

export const getTextAreaDimension = (textArea: DeepRequired<TextArea>) => ({
  width: textArea.text.fontSize * 2,
  height: textArea.text.fontSize * 2,
});

export const drawTextAreaMatte = (ctx: CanvasRenderingContext2D) => (textArea: DeepRequired<TextArea>) => {
  const { width, height } = getTextAreaDimension(textArea);
  drawSquareWithCtx(ctx)({
    at: { x: textArea.at.x, y: textArea.at.y },
    width,
    height,
    color: textArea.color,
  });
}

export const drawText = (ctx: CanvasRenderingContext2D) => (textArea: DeepRequired<TextArea>) => {
  const { at } = textArea;
  const { content, fontSize, fontWeight, color } = textArea.text;

  ctx.font = `${fontWeight} ${fontSize}px Arial`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(content, at.x + fontSize, at.y + fontSize);
}