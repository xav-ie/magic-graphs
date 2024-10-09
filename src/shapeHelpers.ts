/*
  This file contains helper functions for drawing shapes on the canvas.
*/

type CircleOptions = {
  x: number,
  y: number,
  radius: number,
  color: string,
}

export const drawCircleWithCtx = (ctx: CanvasRenderingContext2D) => (options: CircleOptions) => {
  ctx.beginPath();
  ctx.arc(options.x, options.y, options.radius, 0, 2 * Math.PI);
  ctx.fillStyle = options.color;
  ctx.fill();
  ctx.closePath();
}