import {
  drawText,
  drawTextAreaMatte,
  getTextAreaDimension,
  getTextAreaLocation
} from "@shape/text";
import { TEXT_DEFAULTS, TEXTAREA_DEFAULTS, type Coordinate } from "@shape/types";
import { ARROW_DEFAULTS, type Arrow } from ".";
import { rectHitbox } from "@shape/rect/hitbox";
import { getTextAreaLocationOnLine } from "@shape/line/text";

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
    at: getTextAreaLocation.arrow(arrow),
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
    at: getTextAreaLocation.arrow(arrow),
  }
  drawTextAreaMatte(ctx)(fullTextArea);
  queueMicrotask(() => drawText(ctx)(fullTextArea));
}