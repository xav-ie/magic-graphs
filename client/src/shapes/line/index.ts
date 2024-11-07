import type {
  Coordinate,
  Shape,
  TextAreaNoLocation
} from "@shape/types";
import { drawLineWithCtx } from "./draw";
import { lineHitbox, lineEfficientHitbox } from "./hitbox";
import {
  lineTextHitbox,
  drawTextAreaOnLine,
  drawTextAreaMatteOnLine,
  drawTextOnLine,
  getTextAreaLocationOnLine
} from "./text";
import { generateId } from "@graph/helpers";
import { getFullTextArea } from "@shape/text";
import { engageTextarea } from "@shape/textarea";

export type Line = {
  start: Coordinate,
  end: Coordinate,
  width?: number,
  textArea?: TextAreaNoLocation,
  /**
   * offsetFromCenter is used to position text. By default, text is centered on the line.
   * If -10, text will be on the line but 10 units below the center.
   * If 10, text will be on the line but 10 units above the center.
   */
  textOffsetFromCenter?: number,
  color?: string,
}

export const LINE_DEFAULTS = {
  width: 10,
  textOffsetFromCenter: 0,
  color: 'black',
} as const

export const line = (options: Line): Shape => {

  if (options.width && options.width < 0) {
    throw new Error('lineWidth must be positive')
  }

  const drawShape = drawLineWithCtx(options);

  const shapeHitbox = lineHitbox(options);
  const textHitbox = lineTextHitbox(options);
  const efficientHitbox = lineEfficientHitbox(options)
  const hitbox = (point: Coordinate) => {
    return textHitbox?.(point) || shapeHitbox(point)
  }

  const drawTextArea = drawTextAreaOnLine(options);

  const drawTextAreaMatte = drawTextAreaMatteOnLine(options);
  const drawText = drawTextOnLine(options);

  const draw = (ctx: CanvasRenderingContext2D) => {
    drawShape(ctx);
    drawTextArea?.(ctx);
  }

  const activateTextArea = (handler: (str: string) => void) => {
    if (!options.textArea) return;
    const location = getTextAreaLocationOnLine(options);
    const fullTextArea = getFullTextArea(options.textArea, location);
    engageTextarea(fullTextArea, handler);
  }

  return {
    id: generateId(),
    name: 'line',

    draw,

    drawShape,
    drawTextArea,
    drawTextAreaMatte,
    drawText,

    hitbox,
    shapeHitbox,
    textHitbox,
    efficientHitbox,

    activateTextArea,
  }
}