import { TEXT_DEFAULTS } from "@shape/types";
import {
  drawTextWithTextArea,
  drawTextMatteWithTextArea,
  getFullTextArea
} from "@shape/text";
import { rotatePoint } from "@shape/helpers";
import { UTURN_DEFAULTS } from ".";
import type { UTurn } from ".";

export const getTextAreaLocationOnUTurn = (uturn: UTurn) => {
  const {
    center,
    upDistance,
    angle,
    textArea,
    spacing,
  } = {
    ...UTURN_DEFAULTS,
    ...uturn
  };

  if (!textArea) throw new Error('no text area provided')

  const { text } = textArea

  const { fontSize } = {
    ...TEXT_DEFAULTS,
    ...text,
  }

  const endPoint = rotatePoint({
    x: center.x + upDistance + spacing ,
    y: center.y
  }, center, angle)

  return {
    x: endPoint.x - fontSize,
    y: endPoint.y - fontSize
  }
}

export const drawTextAreaMatteOnUTurn = (uturn: UTurn) => {
  if (!uturn.textArea) return;

  const location = getTextAreaLocationOnUTurn(uturn);
  const fullTextArea = getFullTextArea(uturn.textArea, location);

  const drawMatte = drawTextMatteWithTextArea(fullTextArea);
  return (ctx: CanvasRenderingContext2D) => drawMatte(ctx);
};


export const drawTextOnUTurn = (uturn: UTurn) => {
  if (!uturn.textArea) return;

  const location = getTextAreaLocationOnUTurn(uturn);
  const fullTextArea = getFullTextArea(uturn.textArea, location);

  const drawText = drawTextWithTextArea(fullTextArea);
  return (ctx: CanvasRenderingContext2D) => drawText(ctx);
}

export const drawTextAreaOnUTurn = (uturn: UTurn) => {
  const drawMatte = drawTextAreaMatteOnUTurn(uturn);
  const drawText = drawTextOnUTurn(uturn);

  if (!drawMatte || !drawText) return;

  return (ctx: CanvasRenderingContext2D) => {
    drawMatte(ctx);
    drawText(ctx);
  }
}