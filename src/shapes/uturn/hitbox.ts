import { rotatePoint } from "@shape/helpers";
import { TEXT_DEFAULTS, TEXTAREA_DEFAULTS, type Coordinate } from "@shape/types";
import { lineHitbox } from "@shape/line/hitbox";
import type { UTurn } from ".";
import { getTextAreaDimension, getTextAreaLocation } from "@shape/text";
import { rectHitbox } from "@shape/rect/hitbox";

export const uturnHitbox = (uturn: UTurn) => {
  const {
    spacing,
    center,
    upDistance,
    lineWidth,
    angle
  } = uturn;

  const isInLine = lineHitbox({
    start: center,
    end: rotatePoint({ x: center.x + upDistance, y: center.y }, center, angle),
    width: 2 * spacing + lineWidth
  })

  return (point: Coordinate) => isInLine(point);
}

export const uturnTextHitbox =  (uTurn: UTurn) => {
  if (!uTurn.textArea) return;

  const textArea = {
    ...TEXTAREA_DEFAULTS,
    ...uTurn.textArea
  };

  const text = {
    ...TEXT_DEFAULTS,
    ...textArea.text
  };

  const fullTextArea = {
    ...textArea,
    text,
    at: getTextAreaLocation.uTurn(uTurn),
  }

  const { width, height } = getTextAreaDimension(fullTextArea);

  const isInTextHitbox = rectHitbox({
    at: fullTextArea.at,
    width,
    height
  })

  return (point: Coordinate) => isInTextHitbox(point);
}