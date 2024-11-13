import { CIRCLE_DEFAULTS } from "@shape/circle";
import type { Circle } from "@shape/circle";

export const drawCircleWithCtx = (options: Circle) => (ctx: CanvasRenderingContext2D) => {

  const {
    at,
    radius,
    color,
    stroke
  } = { ...CIRCLE_DEFAULTS, ...options };

  ctx.beginPath();
  ctx.arc(at.x, at.y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();

  if (stroke) {
    const { color, width, dash } = stroke;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash || []);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.closePath();
}
