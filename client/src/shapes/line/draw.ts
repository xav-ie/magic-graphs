import { LINE_DEFAULTS } from ".";
import type { Line } from ".";

export const drawLineWithCtx = (line: Line) => (ctx: CanvasRenderingContext2D) => {
  const {
    start,
    end,
    width,
    color
  } = {
    ...LINE_DEFAULTS,
    ...line
  };

  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.closePath();
}