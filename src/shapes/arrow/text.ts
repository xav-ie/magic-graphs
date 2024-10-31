import {
  drawText,
  drawTextAreaMatte,
  getTextAreaDimension,
} from "@shape/text";
import { TEXT_DEFAULTS, TEXTAREA_DEFAULTS } from "@shape/types";
import type { Coordinate } from "@shape/types";
import { rectHitbox } from "@shape/rect/hitbox";
import { getTextAreaLocationOnLine } from "@shape/line/text";
import { ARROW_DEFAULTS } from ".";
import type { Arrow } from ".";

export const arrowTextHitbox = (arrow: Arrow) => {
  if (!arrow.textArea) return;

  const textArea = {
    ...TEXTAREA_DEFAULTS,
    ...arrow.textArea
  };

  const text = {
    ...TEXT_DEFAULTS,
    ...textArea.text
  };

  const fullTextArea = {
    ...textArea,
    text,
    at: getTextAreaLocationOnArrow(arrow),
  }

  const { width, height } = getTextAreaDimension(fullTextArea);

  const isInText = rectHitbox({
    at: fullTextArea.at,
    width,
    height
  })

  return (point: Coordinate) => isInText(point);
}

export const getTextAreaLocationOnArrow = (arrow: Arrow) => {

  const {
    textOffsetFromCenter,
    start: lineStart,
    end: lineEnd,
    textArea,
    width,
    color
  } = {
    ...ARROW_DEFAULTS,
    ...arrow,
  }

  if (!textArea) throw new Error('no text area provided');

  const angle = Math.atan2(lineEnd.y - lineStart.y, lineEnd.x - lineStart.x);
  const arrowHeadHeight = width * 2.5;

  const shaftEnd = {
    x: lineEnd.x - arrowHeadHeight * Math.cos(angle),
    y: lineEnd.y - arrowHeadHeight * Math.sin(angle),
  }

  const shaft = {
    start: lineStart,
    end: shaftEnd,
    width,
    color,
    textOffsetFromCenter,
    textArea,
  }

  return getTextAreaLocationOnLine(shaft);
}

export const drawTextOnArrow = (arrow: Arrow) => (ctx: CanvasRenderingContext2D) => {
  if (!arrow.textArea) return;

  const textArea = {
    ...TEXTAREA_DEFAULTS,
    ...arrow.textArea,
  }

  const text = {
    ...TEXT_DEFAULTS,
    ...textArea.text,
  }

  const fullTextArea = {
    ...textArea,
    text,
    at: getTextAreaLocationOnArrow(arrow),
  }

  drawTextAreaMatte(ctx)(fullTextArea);
  queueMicrotask(() => drawText(ctx)(fullTextArea));
}