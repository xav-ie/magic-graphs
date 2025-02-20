import type { Square } from '.';
import { drawRectWithCtx } from '@shape/rect/draw';

export const drawSquareWithCtx = (options: Square) => {
  const drawRect = drawRectWithCtx({
    width: options.size,
    height: options.size,
    ...options,
  });
  return (ctx: CanvasRenderingContext2D) => drawRect(ctx);
};
