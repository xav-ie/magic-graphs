import { rotatePoint } from "@shape/helpers";
import { drawTriangleWithCtx } from "@shape/triangle/draw";
import { drawLineWithCtx } from "@shape/line/draw";
import { UTURN_DEFAULTS } from ".";
import type { UTurn } from ".";

export const drawUTurnWithCtx = (options: UTurn) => {

  const {
    spacing,
    at,
    upDistance,
    downDistance,
    rotation,
    lineWidth,
    color
  } = {
    ...UTURN_DEFAULTS,
    ...options
  }

  const arrowHeadHeight = lineWidth * 2.5;
  const perpLineLength = arrowHeadHeight / 1.75;

  const longLegFrom = rotatePoint({
    x: at.x,
    y: at.y - spacing
  }, at, rotation);

  const longLegTo = rotatePoint({
    x: at.x + upDistance,
    y: at.y - spacing
  }, at, rotation);

  const shortLegFrom = rotatePoint({
    x: at.x + upDistance,
    y: at.y + spacing
  }, at, rotation);

  const shortLegTo = rotatePoint({
    x: at.x + upDistance - downDistance + arrowHeadHeight,
    y: at.y + spacing
  }, at, rotation);

  const arcAt = rotatePoint({
    x: at.x + upDistance,
    y: at.y
  }, at, rotation);

  const arrowHeadBaseCenterPoint = shortLegTo

  const trianglePt1 = {
    x: arrowHeadBaseCenterPoint.x - arrowHeadHeight * Math.cos(rotation),
    y: arrowHeadBaseCenterPoint.y - arrowHeadHeight * Math.sin(rotation),
  };

  // +0.01 to overlap 
  const trianglePt2 = {
    x: arrowHeadBaseCenterPoint.x - perpLineLength * Math.cos(rotation + Math.PI / 2 + 0.01),
    y: arrowHeadBaseCenterPoint.y - perpLineLength * Math.sin(rotation + Math.PI / 2 + 0.01),
  };

  // -0.01 to overlap 
  const trianglePt3 = {
    x: arrowHeadBaseCenterPoint.x + perpLineLength * Math.cos(rotation + Math.PI / 2 - 0.01),
    y: arrowHeadBaseCenterPoint.y + perpLineLength * Math.sin(rotation + Math.PI / 2 - 0.01),
  };

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
    // +0.01, -0.01 to overlap
    ctx.arc(arcAt.x, arcAt.y, spacing, Math.PI / 2 + rotation + 0.01, -Math.PI / 2 + rotation - 0.01, true);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
  }
}