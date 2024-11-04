import { generateId } from "@graph/helpers";
import { LINE_DEFAULTS } from "@shape/line";
import type { Line } from "@shape/line";
import type { Shape } from "@shape/types";
import { drawArrowWithCtx } from "./draw";
import { arrowHitbox } from "./hitbox";
import { engageTextarea } from "@shape/textarea";
import {
  arrowTextHitbox,
  drawTextOnArrow,
  drawTextAreaMatteOnArrow,
  drawTextAreaOnArrow,
  getTextAreaLocationOnArrow
} from "./text";
import { getFullTextArea } from "@shape/text";

export type Arrow = Line

export const ARROW_DEFAULTS = LINE_DEFAULTS

export const arrow = (options: Arrow): Shape => {

  if (options.width && options.width < 0) {
    throw new Error('width must be positive')
  }
  
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

  const activateTextArea = (handler: (str: string) => void) => {
    if (!options.textArea) return;
    const location = getTextAreaLocationOnArrow(options);
    const fullTextArea = getFullTextArea(options.textArea, location);
    engageTextarea(fullTextArea, handler);
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

    activateTextArea,
  }
}