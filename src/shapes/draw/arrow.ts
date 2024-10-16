import { type Line, ARROW_DEFAULTS } from '../types';
import { drawLineWithCtx } from './line';
import { drawTriangleWithCtx } from './triangle';
import { drawTextOnLineWithCtx } from '../draw';

export const drawArrowWithCtx = (ctx: CanvasRenderingContext2D) => (options: Line) => {
  const drawLine = drawLineWithCtx(ctx);
  const drawTriangle = drawTriangleWithCtx(ctx);
  const {
    start: lineStart,
    end: lineEnd,
    width,
    color
  } = {
    ...ARROW_DEFAULTS,
    ...options
  };

  const angle = Math.atan2(lineEnd.y - lineStart.y, lineEnd.x - lineStart.x);

  const arrowHeadHeight = width * 2.5;
  const shaftEnd = {
    x: lineEnd.x - arrowHeadHeight * Math.cos(angle),
    y: lineEnd.y - arrowHeadHeight * Math.sin(angle),
  }

  const perpLineLength = arrowHeadHeight / 1.75;

  const trianglePt1 = lineEnd;

  const trianglePt2 = {
    x: shaftEnd.x + perpLineLength * Math.cos(angle + Math.PI / 2),
    y: shaftEnd.y + perpLineLength * Math.sin(angle + Math.PI / 2),
  }

  const trianglePt3 = {
    x: shaftEnd.x - perpLineLength * Math.cos(angle + Math.PI / 2),
    y: shaftEnd.y - perpLineLength * Math.sin(angle + Math.PI / 2),
  }

  const shaft = {
    start: lineStart,
    end: shaftEnd,
    width,
    color,
  }

  drawLine(shaft);

  drawTriangle({
    point1: trianglePt1,
    point2: trianglePt2,
    point3: trianglePt3,
    color,
  });

  // text must be drawn over the arrow
  if (options.textArea) drawTextOnLineWithCtx(ctx)({
    ...shaft,
    textArea: options.textArea,
  });
}