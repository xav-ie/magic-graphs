import { rotatePoint } from "../helpers";
import { drawLineWithCtx } from "./line";
import { drawTriangleWithCtx } from "./triangle";
import { type UTurnArrow, UTURN_ARROW_DEFAULTS } from "../types";

export const drawUTurnArrowWithCtx = (ctx: CanvasRenderingContext2D) => (options: UTurnArrow) => {
  const {
    spacing,
    center,
    upDistance,
    downDistance,
    angle,
    lineWidth,
    color
  } = {
    ...UTURN_ARROW_DEFAULTS,
    ...options
  }

  const arrowHeadHeight = lineWidth * 2.4;
  const pLineLength = arrowHeadHeight / 1.75;

  const longLegFrom = rotatePoint({ x: center.x, y: center.y - spacing }, center, angle);
  const longLegTo = rotatePoint({ x: center.x + upDistance, y: center.y - spacing}, center, angle);

  const shortLegFrom = rotatePoint({ x: center.x + upDistance, y: center.y + spacing }, center, angle);
  const shortLegTo = rotatePoint({ x: center.x + upDistance - downDistance, y: center.y + spacing }, center, angle);

  const arcCenter = rotatePoint({ x: center.x + upDistance, y: center.y }, center, angle);

  const epiCenter = {
    x: shortLegTo.x + pLineLength * Math.cos(angle),
    y: shortLegTo.y + pLineLength * Math.sin(angle),
  }

  const trianglePt1 = rotatePoint({ x: center.x + upDistance - downDistance - pLineLength, y: center.y + spacing }, center, angle);

  const trianglePt2 = {
    x: epiCenter.x + pLineLength * Math.cos(angle + Math.PI / 2),
    y: epiCenter.y + pLineLength * Math.sin(angle + Math.PI / 2),
  }

  const trianglePt3 = {
    x: epiCenter.x - pLineLength * Math.cos(angle + Math.PI / 2),
    y: epiCenter.y - pLineLength * Math.sin(angle + Math.PI / 2),
  }

  const drawLine = drawLineWithCtx(ctx);
  const drawTriangle = drawTriangleWithCtx(ctx);

  drawTriangle({
    point1: trianglePt1,
    point2: trianglePt2,
    point3: trianglePt3,
    color
  })

  drawLine({
    start: { x: longLegFrom.x, y: longLegFrom.y },
    end: { x: longLegTo.x, y: longLegTo.y },
    width: lineWidth,
    color
  })

  drawLine({
    start: { x: shortLegFrom.x, y: shortLegFrom.y },
    end: { x: shortLegTo.x, y: shortLegTo.y },
    width: lineWidth,
    color
  })

  // draw the part that uturns
  ctx.beginPath();
  ctx.arc(arcCenter.x, arcCenter.y, spacing, Math.PI / 2 + angle, -Math.PI / 2 + angle, true);
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.closePath();
}