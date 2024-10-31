import { TEXT_DEFAULTS, TEXTAREA_DEFAULTS } from "@shape/types";
import type { Coordinate } from "@shape/types";
import { lineHitbox } from "@shape/line/hitbox";
import { getTextAreaDimension, getTextAreaLocation } from "@shape/text";
import { rectHitbox } from "@shape/rect/hitbox";
import type { Arrow } from ".";

/**
 * TODO - Check arrow tips!
 */
export const arrowHitbox = (arrow: Arrow) => {
  const isInLine = lineHitbox(arrow);
  return (point: Coordinate) => isInLine(point);
}

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
