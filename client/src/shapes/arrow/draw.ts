import { drawLineWithCtx } from "@shape/line/draw";
import { drawTriangleWithCtx } from "@shape/triangle/draw";
import { ARROW_DEFAULTS } from ".";
import type { Arrow } from ".";

export const drawArrowWithCtx = (options: Arrow) => {

  const {
    start: lineStart,
    end: lineEnd,
    width,
    color,
  } = {
    ...ARROW_DEFAULTS,
    ...options
  };

  const angle = Math.atan2(lineEnd.y - lineStart.y, lineEnd.x - lineStart.x);

  const arrowHeadHeight = width * 2.5;
  const perpLineLength = arrowHeadHeight / 1.75;
  
  const shaftEnd = {
    x: lineEnd.x - arrowHeadHeight * Math.cos(angle),
    y: lineEnd.y - arrowHeadHeight * Math.sin(angle),
  }

  const trianglePt1 = lineEnd;

  const trianglePt2 = {
    x: shaftEnd.x + perpLineLength * Math.cos(angle + Math.PI / 2),
    y: shaftEnd.y + perpLineLength * Math.sin(angle + Math.PI / 2),
  }

  const trianglePt3 = {
    x: shaftEnd.x - perpLineLength * Math.cos(angle + Math.PI / 2),
    y: shaftEnd.y - perpLineLength * Math.sin(angle + Math.PI / 2),
  }

  const shaft = {
    start: lineStart,
    // Add sines to make solve overlap issue with triangle when drawing (gh issue #24)
    end: {
      x: shaftEnd.x + Math.cos(angle),
      y: shaftEnd.y + Math.sin(angle)
    },
    width,
    color,
  }

  const drawShaft = drawLineWithCtx(shaft);
  const drawHead = drawTriangleWithCtx({
    point1: trianglePt1,
    point2: trianglePt2,
    point3: trianglePt3,
    color,
  });

  return (ctx: CanvasRenderingContext2D) => {
    drawShaft(ctx);
    drawHead(ctx);
  }
};