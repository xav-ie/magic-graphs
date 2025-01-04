import { rotatePoint } from "@shape/helpers";
import { drawLineWithCtx } from "@shape/line/draw";
import { UTURN_DEFAULTS } from ".";
import type { UTurn } from ".";
import { drawArrowWithCtx } from "@shape/arrow/draw";

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
    x: at.x + upDistance - downDistance,
    y: at.y + spacing
  }, at, rotation);

  const arcAt = rotatePoint({
    x: at.x + upDistance,
    y: at.y
  }, at, rotation);

  const drawLongShaft = drawLineWithCtx({
    start: longLegFrom,
    end: longLegTo,
    width: lineWidth,
    color
  });

  const drawArrow = drawArrowWithCtx({
    start: shortLegFrom,
    end: shortLegTo,
    width: lineWidth,
    color,
    arrowHeadSize: () => ({ arrowHeadHeight, perpLineLength })
  });

  return (ctx: CanvasRenderingContext2D) => {
    drawLongShaft(ctx);
    drawArrow(ctx)

    // draw the part that uturns
    ctx.beginPath();
    // +0.01, -0.01 to overlap
    ctx.arc(arcAt.x, arcAt.y, spacing, Math.PI / 2 + rotation + 0.01, -Math.PI / 2 + rotation - 0.01, true);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.closePath();
  }
}