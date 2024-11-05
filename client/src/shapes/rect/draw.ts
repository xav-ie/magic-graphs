import { TEXT_DEFAULTS } from "@shape/types";
import { RECT_DEFAULTS } from ".";
import type { Rect } from ".";
import { rotatePoint } from "@shape/helpers";

export const drawRectWithCtx = (options: Rect) => (ctx: CanvasRenderingContext2D) => {
  const {
    at,
    width,
    height,
    color,
    borderRadius,
    rotation = 0,
  } = {
    ...RECT_DEFAULTS,
    ...options
  };

  ctx.save();

  const centerX = at.x + width / 2;
  const centerY = at.y + height / 2;
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);

  if (borderRadius === 0) {
    ctx.beginPath();
    ctx.rect(-width / 2, -height / 2, width, height);
    ctx.fillStyle = color;
    ctx.fill();
  } else {
    const radius = Math.min(borderRadius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(-width / 2 + radius, -height / 2);
    ctx.lineTo(width / 2 - radius, -height / 2);
    ctx.arcTo(width / 2, -height / 2, width / 2, -height / 2 + radius, radius);
    ctx.lineTo(width / 2, height / 2 - radius);
    ctx.arcTo(width / 2, height / 2, width / 2 - radius, height / 2, radius);
    ctx.lineTo(-width / 2 + radius, height / 2);
    ctx.arcTo(-width / 2, height / 2, -width / 2, height / 2 - radius, radius);
    ctx.lineTo(-width / 2, -height / 2 + radius);
    ctx.arcTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2, radius);
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
    const { content, fontSize, fontWeight, color } = {
      ...TEXT_DEFAULTS,
      ...options.text
    };
    ctx.font = `${fontWeight} ${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(content, 0, 0);
  }

  ctx.restore();
};
