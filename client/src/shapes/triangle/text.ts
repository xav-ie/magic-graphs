import { TEXT_DEFAULTS } from "@shape/types";
import type { Coordinate } from "@shape/types";
import type { Triangle } from "@shape/triangle";
import {
  drawTextWithTextArea,
  drawTextMatteWithTextArea,
  getTextAreaDimension,
  getFullTextArea,
} from "@shape/text";
import { rectHitbox } from "@shape/rect/hitbox";
import { TRIANGLE_DEFAULTS } from ".";

export const getTextAreaLocationOnTriangle = (triangle: Triangle) => {
  const { point1, point2, point3, textArea } = { ...TRIANGLE_DEFAULTS, ...triangle };

  if (!textArea) throw new Error("no text area provided");

  const { text } = textArea;

  const { fontSize } = {
    ...TEXT_DEFAULTS,
    ...text,
  };

  const centerX = (point1.x + point2.x + point3.x) / 3;
  const centerY = (point1.y + point2.y + point3.y) / 3;

  return {
    x: centerX - fontSize,
    y: centerY - fontSize,
  };
};

/**
 * @description checks if the point is in the text label of the triangle
 *
 * @param point - the point to check if it is in the triangle
 * @returns a function that checks if the point is in the triangle
 */
export const triangleTextHitbox = (triangle: Triangle) => {
  if (!triangle.textArea) return;

  const location = getTextAreaLocationOnTriangle(triangle);
  const fullTextArea = getFullTextArea(triangle.textArea, location);

  const { width, height } = getTextAreaDimension(fullTextArea);

  const isInTextHitbox = rectHitbox({
    at: fullTextArea.at,
    width,
    height,
  });

  return (point: Coordinate) => isInTextHitbox(point);
};

export const drawTextAreaMatteOnTriangle = (triangle: Triangle) => {
  if (!triangle.textArea) return;

  const location = getTextAreaLocationOnTriangle(triangle);
  const fullTextArea = getFullTextArea(triangle.textArea, location);

  const drawMatte = drawTextMatteWithTextArea(fullTextArea);
  return (ctx: CanvasRenderingContext2D) => drawMatte(ctx);
};

export const drawTextOnTriangle = (triangle: Triangle) => {
  if (!triangle.textArea) return;

  const location = getTextAreaLocationOnTriangle(triangle);
  const fullTextArea = getFullTextArea(triangle.textArea, location);

  const drawText = drawTextWithTextArea(fullTextArea);
  return (ctx: CanvasRenderingContext2D) => drawText(ctx);
};

export const drawTextAreaOnTriangle = (triangle: Triangle) => {
  const drawMatte = drawTextAreaMatteOnTriangle(triangle);
  const drawText = drawTextOnTriangle(triangle);

  if (!drawMatte || !drawText) return;

  return (ctx: CanvasRenderingContext2D) => {
    drawMatte(ctx);
    drawText(ctx);
  };
};
