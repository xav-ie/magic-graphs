import { rotatePoint } from "@shape/helpers";
import { drawTriangleWithCtx } from "@shape/triangle/draw";
import { drawLineWithCtx } from "@shape/line/draw";
import { UTURN_DEFAULTS } from ".";
import type { UTurn } from ".";

export const drawUTurnWithCtx = (options: UTurn) => {

  const {
    spacing,
    center,
    upDistance,
    downDistance,
    angle,
    lineWidth,
    color
  } = {
    ...UTURN_DEFAULTS,
    ...options
  }

  const arrowHeadHeight = lineWidth * 2.4;
  const pLineLength = arrowHeadHeight / 1.75;

  const longLegFrom = rotatePoint({ x: center.x, y: center.y - spacing }, center, angle);
  const longLegTo = rotatePoint({ x: center.x + upDistance, y: center.y - spacing }, center, angle);

  const shortLegFrom = rotatePoint({ x: center.x + upDistance, y: center.y + spacing }, center, angle);
  const shortLegTo = rotatePoint({ x: center.x + upDistance - downDistance, y: center.y + spacing }, center, angle);

  const arcCenter = rotatePoint({ x: center.x + upDistance, y: center.y }, center, angle);

  const epiCenter = {
    x: shortLegTo.x + pLineLength * Math.cos(angle),
    y: shortLegTo.y + pLineLength * Math.sin(angle),
  }

  const trianglePt1 = rotatePoint({
    x: center.x + upDistance - downDistance - pLineLength,
    y: center.y + spacing
  }, center, angle);

  const trianglePt2 = {
    x: epiCenter.x + pLineLength * Math.cos(angle + Math.PI / 2),
    y: epiCenter.y + pLineLength * Math.sin(angle + Math.PI / 2),
  }

  const trianglePt3 = {
    x: epiCenter.x - pLineLength * Math.cos(angle + Math.PI / 2),
    y: epiCenter.y - pLineLength * Math.sin(angle + Math.PI / 2),
  }

  const drawHead = drawTriangleWithCtx({
    point1: trianglePt1,
    point2: trianglePt2,
    point3: trianglePt3,
    color
  });

  const drawLongShaft = drawLineWithCtx({
    start: longLegFrom,
    end: longLegTo,
    width: lineWidth,
    color
  });

  const drawShortShaft = drawLineWithCtx({
    start: shortLegFrom,
    end: shortLegTo,
    width: lineWidth,
    color
  });

  return (ctx: CanvasRenderingContext2D) => {
    drawLongShaft(ctx);
    drawHead(ctx);
    drawShortShaft(ctx);

    // draw the part that uturns
    ctx.beginPath();
    ctx.arc(arcCenter.x, arcCenter.y, spacing, Math.PI / 2 + angle + 0.05, -Math.PI / 2 + angle - 0.05, true);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
  }
}