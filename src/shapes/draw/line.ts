import { type Line, LINE_DEFAULTS, TEXT_DEFAULTS } from '../types';
import { drawTextAreaWithCtx } from '../draw';
import { getAngle } from '../helpers';

export const drawLineWithCtx = (ctx: CanvasRenderingContext2D) => (options: Line) => {

  const {
    start,
    end,
    color,
    width
  } = {
    ...LINE_DEFAULTS,
    ...options
  };

  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
  ctx.closePath();

  if (options.textArea) drawTextAreaWithCtx(ctx).line(options);
}

export const getTextAreaLocationOnLine = (line: Line) => {
  const {
    textOffsetFromCenter,
    start,
    end,
    textArea,
  } = {
    ...LINE_DEFAULTS,
    ...line,
  }

  if (!textArea) return { x: 0, y: 0 }

  const { text } = textArea;

  const { fontSize } = {
    ...TEXT_DEFAULTS,
    ...text,
  }

  const theta = getAngle(start, end);

  const offsetX = textOffsetFromCenter * Math.cos(theta);
  const offsetY = textOffsetFromCenter * Math.sin(theta);

  const textX = (start.x + end.x) / 2 + offsetX;
  const textY = (start.y + end.y) / 2 + offsetY;

  return {
    x: textX - fontSize,
    y: textY - fontSize
  }
}
