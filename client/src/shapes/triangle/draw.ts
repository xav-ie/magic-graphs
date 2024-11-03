import { TRIANGLE_DEFAULTS } from ".";
import type { Triangle } from ".";

export const drawTriangleWithCtx = (options: Triangle) => (ctx: CanvasRenderingContext2D) => {

  const {
    point1,
    point2,
    point3,
    color
  } = {
    ...TRIANGLE_DEFAULTS,
    ...options
  };

  ctx.beginPath();
  ctx.moveTo(point1.x, point1.y);
  ctx.lineTo(point2.x, point2.y);
  ctx.lineTo(point3.x, point3.y);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}