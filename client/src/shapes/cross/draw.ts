import { CROSS_DEFAULTS } from ".";
import type { Cross } from ".";
import { drawRectWithCtx } from "@shape/rect/draw";

export const drawCrossWithCtx = (options: Cross) => {
  const {
    center,
    size,
    angle,
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
      at: { x: center.x - halfLineWidth, y: center.y - size / 2 },
      width: lineWidth,
      height: size,
      color,
      borderRadius,
      rotation: angle,
    })(ctx);
    drawRectWithCtx({
      at: { x: center.x - size / 2, y: center.y - halfLineWidth },
      width: size,
      height: lineWidth,
      color,
      borderRadius,
      rotation: angle,
    })(ctx);
  };
};
