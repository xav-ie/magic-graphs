import { type Line, LINE_DEFAULTS } from '../types';
import { drawTextAreaWithCtx } from '../draw';

export const drawLineWithCtx = (ctx: CanvasRenderingContext2D) => (options: Line) => {

  const {
    start,
    end,
    color,
    width
  } = {
    ...LINE_DEFAULTS,
    ...options
  };

  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
  ctx.closePath();

  if (options.textArea) drawTextAreaWithCtx(ctx).line(options);
}
