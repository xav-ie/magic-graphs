import { LINE_DEFAULTS } from ".";
import type { Line } from ".";

export const drawLineWithCtx = (line: Line) => (ctx: CanvasRenderingContext2D) => {
  const {
    start,
    end,
    width,
    color,
    dash,
  } = {
    ...LINE_DEFAULTS,
    ...line
  };

  if (width === 0) return;

  ctx.save()
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.setLineDash(dash);
  ctx.stroke();
  ctx.closePath();
  ctx.restore()
}