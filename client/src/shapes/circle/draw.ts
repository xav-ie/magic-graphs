import { TEXT_DEFAULTS } from "@shape/types";
import { CIRCLE_DEFAULTS } from "@shape/circle";
import type { Circle } from "@shape/circle";

export const drawCircleWithCtx = (options: Circle) => (ctx: CanvasRenderingContext2D) => {

  const {
    at,
    radius,
    color,
  } = { ...CIRCLE_DEFAULTS, ...options };

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

  const circleText = options.text;
  if (circleText) {
    const {
      content,
      fontSize,
      fontWeight,
      color,
    } = { ...TEXT_DEFAULTS, ...circleText };

    const textVerticalOffset = fontSize >=50 ? 0.3 : 0.1;

    ctx.font = `${fontWeight} ${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(content, at.x, at.y + fontSize ** textVerticalOffset);
  }

  ctx.closePath();
}
