import { ELLIPSE_DEFAULTS } from "@shape/ellipse";
import type { Ellipse } from "@shape/ellipse";

export const drawEllipseWithCtx = (options: Ellipse) => (ctx: CanvasRenderingContext2D) => {

  const {
    at,
    radiusX,
    radiusY,
    color,
    stroke
  } = { ...ELLIPSE_DEFAULTS, ...options };

  ctx.beginPath();
  ctx.ellipse(at.x, at.y, radiusX, radiusY, 0, 0, 2 * Math.PI);
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
