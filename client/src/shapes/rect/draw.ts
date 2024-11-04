import { TEXT_DEFAULTS } from "@shape/types";
import { RECT_DEFAULTS } from ".";
import type { Rect } from ".";

export const drawRectWithCtx = (options: Rect) => (ctx: CanvasRenderingContext2D) => {
  const {
    at,
    width,
    height,
    color,
    borderRadius,
  } = {
    ...RECT_DEFAULTS,
    ...options
  };

  if (borderRadius === 0) {
    ctx.beginPath();
    ctx.rect(at.x, at.y, width, height);
    ctx.fillStyle = color;
    ctx.fill();
  } else {
    // ensure radius doesn't exceed width/height
    const radius = Math.min(borderRadius, width / 2, height / 2);

    ctx.beginPath();
    ctx.moveTo(at.x + radius, at.y);
    ctx.lineTo(at.x + width - radius, at.y);
    ctx.arcTo(at.x + width, at.y, at.x + width, at.y + radius, radius);
    ctx.lineTo(at.x + width, at.y + height - radius);
    ctx.arcTo(at.x + width, at.y + height, at.x + width - radius, at.y + height, radius);
    ctx.lineTo(at.x + radius, at.y + height);
    ctx.arcTo(at.x, at.y + height, at.x, at.y + height - radius, radius);
    ctx.lineTo(at.x, at.y + radius);
    ctx.arcTo(at.x, at.y, at.x + radius, at.y, radius);
    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();
  }

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