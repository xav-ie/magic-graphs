/*
  This file contains helper functions for drawing shapes on the canvas.
*/
import type { Circle, Line, Square, Triangle } from "./types"

export const drawShape = (ctx: CanvasRenderingContext2D) => ({
  drawCircle: drawCircleWithCtx(ctx),
  drawLine: drawLineWithCtx(ctx),
  drawSquare: drawSquareWithCtx(ctx),
})

export const drawCircleWithCtx = (ctx: CanvasRenderingContext2D) => (options: Circle) => {
  const { at, radius, color = 'black' } = options;
  ctx.beginPath();
  ctx.arc(at.x, at.y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();

  if (options.stroke) {
    const { color, width } = options.stroke;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  if (options.text) {
    const { content, fontSize, fontWeight, color } = options.text;
    ctx.font = `${fontWeight} ${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(content, at.x, at.y);
  }

  ctx.closePath();
}

export const drawSquareWithCtx = (ctx: CanvasRenderingContext2D) => (options: Square) => {
  const { at, width, height, color = 'black' } = options;
  ctx.beginPath();
  ctx.rect(at.x, at.y, width, height);
  ctx.fillStyle = color;
  ctx.fill();

  if (options.stroke) {
    const { color, width } = options.stroke;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  if (options.text) {
    const { content, fontSize, fontWeight, color } = options.text;
    ctx.font = `${fontWeight} ${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(content, at.x + width / 2, at.y + height / 2);
  }

  ctx.closePath();
}

export const drawLineWithCtx = (ctx: CanvasRenderingContext2D) => (options: Line) => {
  const { start, end, color = 'black', width } = options;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
  ctx.closePath();
}

export const drawTriangleWithCtx = (ctx: CanvasRenderingContext2D) => (options: Triangle) => {
  const { point1, point2, point3, color = 'black' } = options;
  ctx.beginPath();
  ctx.moveTo(point1.x, point1.y);
  ctx.lineTo(point2.x, point2.y);
  ctx.lineTo(point3.x, point3.y);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

export const fn = (ctx: CanvasRenderingContext2D) => (options: Line) => {

}