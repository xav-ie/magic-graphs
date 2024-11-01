import { generateId } from "@graph/helpers";
import { LINE_DEFAULTS } from "@shape/line";
import type { Line } from "@shape/line";
import type { Shape } from "@shape/types";
import { drawArrowWithCtx } from "./draw";
import { arrowHitbox } from "./hitbox";
import {
  arrowTextHitbox,
  drawTextOnArrow,
  drawTextAreaMatteOnArrow,
  drawTextAreaOnArrow
} from "./text";

export type Arrow = Line

export const ARROW_DEFAULTS = LINE_DEFAULTS

export const arrow = (options: Arrow): Shape => {
  const drawShape = drawArrowWithCtx(options);

  const hitbox = arrowHitbox(options);
  const textHitbox = arrowTextHitbox(options);

  const drawTextArea = drawTextAreaOnArrow(options);

  const drawTextAreaMatte = drawTextAreaMatteOnArrow(options);
  const drawText = drawTextOnArrow(options);

  const draw = (ctx: CanvasRenderingContext2D) => {
    drawShape(ctx);
    drawTextArea?.(ctx);
  }

  return {
    id: generateId(),
    name: 'arrow',

    draw,

    drawShape,
    drawTextArea,
    drawTextAreaMatte,
    drawText,

    hitbox,
    textHitbox,
  }
}