import { generateId } from "@graph/helpers";
import { LINE_DEFAULTS } from "@shape/line";
import type { Line } from "@shape/line";
import type { Shape } from "@shape/types";
import { drawArrowWithCtx } from "./draw";
import { arrowHitbox } from "./hitbox";
import { arrowTextHitbox, drawTextOnArrow } from "./text";

export type Arrow = Line

export const ARROW_DEFAULTS = LINE_DEFAULTS

export const arrow = (options: Arrow): Shape => {
  const draw = drawArrowWithCtx(options);
  const drawText = drawTextOnArrow(options);

  const hitbox = arrowHitbox(options);
  const textHitbox = arrowTextHitbox(options);

  return {
    id: generateId(),
    name: 'arrow',

    draw,
    drawText,

    hitbox,
    textHitbox,
  }
}