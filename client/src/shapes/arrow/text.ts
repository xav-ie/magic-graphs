import {
  drawTextWithTextArea,
  drawTextMatteWithTextArea,
  getTextAreaDimension,
  getFullTextArea,
} from "@shape/text";
import { TEXT_DEFAULTS, type Coordinate } from "@shape/types";
import { rectHitbox } from "@shape/rect/hitbox";
import { ARROW_DEFAULTS } from ".";
import type { Arrow } from ".";
import { getAngle } from "@shape/helpers";

export const getTextAreaLocationOnArrow = (arrow: Arrow) => {

  const {
    textOffsetFromCenter,
    start,
    end,
    textArea,
  } = {
    ...ARROW_DEFAULTS,
    ...arrow,
  }

  if (!textArea) throw new Error('no text area provided')

  const { text } = textArea;

  const { fontSize } = {
    ...TEXT_DEFAULTS,
    ...text,
  }

  const angle = getAngle(start, end);

  const offsetX = textOffsetFromCenter * Math.cos(angle);
  const offsetY = textOffsetFromCenter * Math.sin(angle);

  const textX = (start.x + end.x) / 2 + offsetX;
  const textY = (start.y + end.y) / 2 + offsetY;


  return {
    x: textX - fontSize,
    y: textY - fontSize
  }
  
}

export const arrowTextHitbox = (arrow: Arrow) => {
  if (!arrow.textArea) return;

  const location = getTextAreaLocationOnArrow(arrow);
  const fullTextArea = getFullTextArea(arrow.textArea, location);

  const { width, height } = getTextAreaDimension(fullTextArea);

  const isInText = rectHitbox({
    at: fullTextArea.at,
    width,
    height
  })

  return (point: Coordinate) => isInText(point);
}

export const drawTextAreaMatteOnArrow = (arrow: Arrow) => {
  if (!arrow.textArea) return;

  const location = getTextAreaLocationOnArrow(arrow);
  const fullTextArea = getFullTextArea(arrow.textArea, location);

  const drawMatte = drawTextMatteWithTextArea(fullTextArea);
  return (ctx: CanvasRenderingContext2D) => drawMatte(ctx);
};


export const drawTextOnArrow = (arrow: Arrow) => {
  if (!arrow.textArea) return;

  const location = getTextAreaLocationOnArrow(arrow);
  const fullTextArea = getFullTextArea(arrow.textArea, location);

  const drawText = drawTextWithTextArea(fullTextArea);
  return (ctx: CanvasRenderingContext2D) => drawText(ctx);
}

export const drawTextAreaOnArrow = (arrow: Arrow) => {
  const drawMatte = drawTextAreaMatteOnArrow(arrow);
  const drawText = drawTextOnArrow(arrow);

  if (!drawMatte || !drawText) return;

  return (ctx: CanvasRenderingContext2D) => {
    drawMatte(ctx);
    drawText(ctx);
  }
}