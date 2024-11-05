import { CROSS_DEFAULTS } from ".";
import type { Cross } from ".";
import { drawRectWithCtx } from "@shape/rect/draw";

export const drawCrossWithCtx = (options: Cross) => {
  const {
    at,
    size,
    rotation,
    color,
    lineWidth,
    borderRadius,
  } = {
    ...CROSS_DEFAULTS,
    ...options
  };

  const halfLineWidth = lineWidth / 2;

  return (ctx: CanvasRenderingContext2D) => {
    drawRectWithCtx({
      at: { x: at.x - halfLineWidth, y: at.y - size / 2 },
      width: lineWidth,
      height: size,
      color,
      borderRadius,
      rotation,
    })(ctx);
    drawRectWithCtx({
      at: { x: at.x - size / 2, y: at.y - halfLineWidth },
      width: size,
      height: lineWidth,
      color,
      borderRadius,
      rotation,
    })(ctx);
  };
};
