import { TEXT_DEFAULTS, TEXTAREA_DEFAULTS } from "@shape/types";
import type { Coordinate } from "@shape/types";
import {
  drawText,
  drawTextAreaMatte,
  getTextAreaDimension
} from "@shape/text";
import { rectHitbox } from "@shape/rect/hitbox";
import { rotatePoint } from "@shape/helpers";
import { UTURN_DEFAULTS } from ".";
import type { UTurn } from ".";

export const drawTextAreaOnUTurn = (uturn: UTurn) => (ctx: CanvasRenderingContext2D) => {
  if (!uturn.textArea) return;

  const textArea = {
    ...TEXTAREA_DEFAULTS,
    ...uturn.textArea,
  }

  const text = {
    ...TEXT_DEFAULTS,
    ...textArea.text,
  }

  const fullTextArea = {
    ...textArea,
    text,
    at: getTextAreaLocationOnUTurn(uturn),
  }

  drawTextAreaMatte(ctx)(fullTextArea);
  queueMicrotask(() => drawText(ctx)(fullTextArea));
}

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

export const uturnTextHitbox = (uturn: UTurn) => {
  if (!uturn.textArea) return;

  const textArea = {
    ...TEXTAREA_DEFAULTS,
    ...uturn.textArea
  };

  const text = {
    ...TEXT_DEFAULTS,
    ...textArea.text
  };

  const fullTextArea = {
    ...textArea,
    text,
    at: getTextAreaLocationOnUTurn(uturn),
  }

  const { width, height } = getTextAreaDimension(fullTextArea);

  const isInTextHitbox = rectHitbox({
    at: fullTextArea.at,
    width,
    height
  })

  return (point: Coordinate) => isInTextHitbox(point);
}