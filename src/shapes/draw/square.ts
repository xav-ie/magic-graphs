import type { Square } from "@shape/types";
import { SQUARE_DEFAULTS } from "@shape/types";

export const drawSquareWithCtx = (ctx: CanvasRenderingContext2D) => (options: Square) => {
  const {
    at,
    width,
    height,
    color
  } = {
    ...SQUARE_DEFAULTS,
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
      fontSize = 12,
      fontWeight = 'normal',
      color = 'black'
    } = options.text;

    ctx.font = `${fontWeight} ${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(content, at.x + width / 2, at.y + height / 2);
  }

  ctx.closePath();
}