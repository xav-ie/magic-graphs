import { CROSS_DEFAULTS } from ".";
import type { Cross } from ".";
import { drawLineWithCtx } from "@shape/line/draw"
import { rotatePoint } from "@shape/helpers"

export const drawCrossWithCtx = (options: Cross) => {

  const {
    center,
    size,
    angle,
    color,
    lineWidth,
  } = {
    ...CROSS_DEFAULTS,
    ...options
  }

  const points = [
    { x: center.x - size / 2, y: center.y },
    { x: center.x + size / 2, y: center.y },
    { x: center.x, y: center.y - size / 2 },
    { x: center.x, y: center.y + size / 2 },
  ].map(point => rotatePoint(point, center, angle))

  const horizontalLine = drawLineWithCtx({
    start: points[0],
    end: points[1],
    color,
    width: lineWidth,
  })
  
  const verticalLine = drawLineWithCtx({
    start: points[2],
    end: points[3],
    color,
    width: lineWidth,
  })

  return (ctx: CanvasRenderingContext2D) => {
    horizontalLine(ctx)
    verticalLine(ctx)
  };
}