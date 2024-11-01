import { TEXT_DEFAULTS } from "@shape/types";
import { RECT_DEFAULTS } from ".";
import type { Rect } from ".";

export const drawRectWithCtx = (options: Rect) => (ctx: CanvasRenderingContext2D) => {
  const {
    at,
    width,
    height,
    color
  } = {
    ...RECT_DEFAULTS,
    ...options
  };

  ctx.beginPath();
  ctx.rect(at.x, at.y, width, height);
  ctx.fillStyle = color;
  ctx.fill();

  if (options.stroke) {
    const { color, width } = options.stroke;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  if (options.text) {

    const {
      content,
      fontSize,
      fontWeight,
      color
    } = {
      ...TEXT_DEFAULTS,
      ...options.text
    }

    ctx.font = `${fontWeight} ${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(content, at.x + width / 2, at.y + height / 2);
  }

  ctx.closePath();
}