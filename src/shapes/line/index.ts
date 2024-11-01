import type {
  Coordinate,
  Shape,
  TextAreaNoLocation
} from "@shape/types";
import { drawLineWithCtx } from "./draw";
import { lineHitbox } from "./hitbox";
import {
  lineTextHitbox,
  drawTextAreaOnLine,
  drawTextAreaMatteOnLine,
  drawTextOnLine
} from "./text";
import { generateId } from "@graph/helpers";

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
  const drawShape = drawLineWithCtx(options);

  const hitbox = lineHitbox(options);
  const textHitbox = lineTextHitbox(options);

  const drawTextArea = drawTextAreaOnLine(options);

  const drawTextAreaMatte = drawTextAreaMatteOnLine(options);
  const drawText = drawTextOnLine(options);

  const draw = (ctx: CanvasRenderingContext2D) => {
    drawShape(ctx);
    drawTextArea?.(ctx);
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
    textHitbox,
  }
}