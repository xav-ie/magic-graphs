import { TEXT_DEFAULTS, TEXTAREA_DEFAULTS, type Coordinate } from "@shape/types";
import { LINE_DEFAULTS, type Line } from ".";
import {
  drawText,
  drawTextAreaMatte,
  getTextAreaDimension,
  getTextAreaLocation
} from "@shape/text";
import { rectHitbox } from "@shape/rect/hitbox";
import { getAngle } from "@shape/helpers";

/**
 * @description checks if the point is in the text label of the line
 *
 * @param point - the point to check if it is in the line
 * @returns a function that checks if the point is in the line
 */
export const lineTextHitbox = (line: Line) => {
  if (!line.textArea) return;

  const textArea = {
    ...TEXTAREA_DEFAULTS,
    ...line.textArea
   };

  const text = {
    ...TEXT_DEFAULTS,
    ...textArea.text
  };

  const fullTextArea = {
    ...textArea,
    text,
    at: getTextAreaLocation.line(line),
  }

  const { width, height } = getTextAreaDimension(fullTextArea);

  const isInTextHitbox = rectHitbox({
    at: fullTextArea.at,
    width,
    height
  });

  return (point: Coordinate) => isInTextHitbox(point);
}

export const getTextAreaLocationOnLine = (line: Line) => {

  const {
    textOffsetFromCenter,
    start,
    end,
    textArea,
  } = {
    ...LINE_DEFAULTS,
    ...line,
  }

  if (!textArea) return

  const { text } = textArea;

  const { fontSize } = {
    ...TEXT_DEFAULTS,
    ...text,
  }

  const theta = getAngle(start, end);

  const offsetX = textOffsetFromCenter * Math.cos(theta);
  const offsetY = textOffsetFromCenter * Math.sin(theta);

  const textX = (start.x + end.x) / 2 + offsetX;
  const textY = (start.y + end.y) / 2 + offsetY;

  return {
    x: textX - fontSize,
    y: textY - fontSize
  }
}

export const drawTextAreaOnLine = (line: Line) => (ctx: CanvasRenderingContext2D) => {
  if (!line.textArea) return;
  const textArea = {
    ...TEXTAREA_DEFAULTS,
    ...line.textArea,
  }
  const text = {
    ...TEXT_DEFAULTS,
    ...textArea.text,
  }
  const fullTextArea = {
    ...textArea,
    text,
    at: getTextAreaLocation.line(line),
  }
  drawTextAreaMatte(ctx)(fullTextArea);
  queueMicrotask(() => drawText(ctx)(fullTextArea));
}