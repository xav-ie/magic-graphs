import { TRIANGLE_DEFAULTS } from ".";
import type { Triangle } from ".";

export const drawTriangleWithCtx = (options: Triangle) => (ctx: CanvasRenderingContext2D) => {

  const {
    pointA,
    pointB,
    pointC,
    color,
    stroke,
  } = {
    ...TRIANGLE_DEFAULTS,
    ...options
  };

  ctx.beginPath();
  ctx.moveTo(pointA.x, pointA.y);
  ctx.lineTo(pointB.x, pointB.y);
  ctx.lineTo(pointC.x, pointC.y);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();

  if (stroke) {
    ctx.lineWidth = stroke.width;
    ctx.strokeStyle = stroke.color;
    if (stroke.dash) {
      ctx.setLineDash(stroke.dash);
    } else {
      ctx.setLineDash([]);
    }
    ctx.stroke();

    ctx.setLineDash([])
  }
}