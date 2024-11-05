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
    angle,
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
  }, at, angle);

  const longLegTo = rotatePoint({ 
    x: at.x + upDistance, 
    y: at.y - spacing
  }, at, angle);

  const shortLegFrom = rotatePoint({ 
    x: at.x + upDistance, 
    y: at.y + spacing 
  }, at, angle);
  const shortLegTo = rotatePoint({ 
    x: at.x + upDistance - downDistance + arrowHeadHeight, 
    y: at.y + spacing 
  }, at, angle);

  const arcat = rotatePoint({ 
    x: at.x + upDistance, 
    y: at.y 
  }, at, angle);

  const epiat = {
    x: shortLegTo.x + pLineLength * Math.cos(angle),
    y: shortLegTo.y + pLineLength * Math.sin(angle),
  }

  const trianglePt1 = rotatePoint({ 
      x: at.x + upDistance - downDistance, 
      y: at.y + spacing 
    }, at, angle
  );

  const trianglePt2 = {
    x: epiat.x + pLineLength * Math.cos(angle + Math.PI / 2),
    y: epiat.y + pLineLength * Math.sin(angle + Math.PI / 2),
  }

  const trianglePt3 = {
    x: epiat.x - pLineLength * Math.cos(angle + Math.PI / 2),
    y: epiat.y - pLineLength * Math.sin(angle + Math.PI / 2),
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
    ctx.arc(arcat.x, arcat.y, spacing, Math.PI / 2 + angle + 0.05, -Math.PI / 2 + angle - 0.05, true);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
  }
}