import { TEXT_DEFAULTS } from "@shape/types";
import type { Coordinate } from "@shape/types";
import type { Ellipse } from "@shape/ellipse";
import {
  drawTextWithTextArea,
  drawTextMatteWithTextArea,
  getTextAreaDimension,
  getFullTextArea,
} from "@shape/text";
import { rectHitbox } from "@shape/rect/hitbox";
import { ELLIPSE_DEFAULTS } from ".";

export const getTextAreaLocationOnEllipse = (ellipse: Ellipse) => {
  const {
    at,
    textArea    
  } = { ...ELLIPSE_DEFAULTS, ...ellipse };

  if (!textArea) throw new Error("no text area provided");

  const { text } = textArea;

  const { fontSize } = {
    ...TEXT_DEFAULTS,
    ...text,
  };

  return {
    x: at.x - fontSize,
    y: at.y - fontSize,
  };
};

/**
 * @description checks if the point is in the text label of the ellipse
 *
 * @param point - the point to check if it is in the ellipse
 * @returns a function that checks if the point is in the ellipse
 */
export const ellipseTextHitbox = (ellipse: Ellipse) => {
  if (!ellipse.textArea) return;

  const location = getTextAreaLocationOnEllipse(ellipse);
  const fullTextArea = getFullTextArea(ellipse.textArea, location);

  const { width, height } = getTextAreaDimension(fullTextArea);

  const isInTextHitbox = rectHitbox({
    at: fullTextArea.at,
    width,
    height,
  });

  return (point: Coordinate) => isInTextHitbox(point);
};

export const drawTextAreaMatteOnEllipse = (ellipse: Ellipse) => {
  if (!ellipse.textArea) return;

  const location = getTextAreaLocationOnEllipse(ellipse);
  const fullTextArea = getFullTextArea(ellipse.textArea, location);

  const drawMatte = drawTextMatteWithTextArea(fullTextArea);
  return (ctx: CanvasRenderingContext2D) => drawMatte(ctx);
};

export const drawTextOnEllipse = (ellipse: Ellipse) => {
  if (!ellipse.textArea) return;

  const location = getTextAreaLocationOnEllipse(ellipse);
  const fullTextArea = getFullTextArea(ellipse.textArea, location);

  const drawText = drawTextWithTextArea(fullTextArea);
  return (ctx: CanvasRenderingContext2D) => drawText(ctx);
};

export const drawTextAreaOnEllipse = (ellipse: Ellipse) => {
  const drawMatte = drawTextAreaMatteOnEllipse(ellipse);
  const drawText = drawTextOnEllipse(ellipse);

  if (!drawMatte || !drawText) return;

  return (ctx: CanvasRenderingContext2D) => {
    drawMatte(ctx);
    drawText(ctx);
  };
};
