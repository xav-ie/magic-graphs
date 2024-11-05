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

  const arrowHeadHeight = lineWidth * 1.4;
  const pLineLength = arrowHeadHeight;

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

  const epiAt = {
    x: shortLegTo.x + pLineLength * Math.cos(rotation),
    y: shortLegTo.y + pLineLength * Math.sin(rotation),
  }

  const triRotationPoint1 = rotatePoint({ 
      x: at.x + upDistance - downDistance, 
      y: at.y + spacing 
    }, at, rotation
  );

  const triRotationPoint2 = {
    x: epiAt.x + pLineLength * Math.cos(rotation + Math.PI / 2),
    y: epiAt.y + pLineLength * Math.sin(rotation + Math.PI / 2),
  }

  const triRotationPoint3 = {
    x: epiAt.x - pLineLength * Math.cos(rotation + Math.PI / 2),
    y: epiAt.y - pLineLength * Math.sin(rotation + Math.PI / 2),
  }

  const drawHead = drawTriangleWithCtx({
    point1: triRotationPoint1,
    point2: triRotationPoint2,
    point3: triRotationPoint3,
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
    ctx.arc(arcAt.x, arcAt.y, spacing, Math.PI / 2 + rotation + 0.05, -Math.PI / 2 + rotation - 0.05, true);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
  }
}