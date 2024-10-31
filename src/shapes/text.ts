import {
  TEXTAREA_DEFAULTS,
  TEXT_DEFAULTS
} from "@shape/types";

import type { Line } from "@shape/line"
import type { Arrow } from "@shape/arrow"
import type { UTurn } from "@shape/uturn"
import type { TextArea } from "@shape/types"

import { drawShape } from "@shape/draw";
import type { DeepRequired } from "@utils/types";

import { getTextAreaLocationOnUTurnArrow } from "./uturn";

export const drawTextArea = (ctx: CanvasRenderingContext2D) => ({

  uTurn: (uturn: UTurn) => {
    if (!uturn.textArea) return;
    const textArea = {
      ...TEXTAREA_DEFAULTS,
      ...uturn.textArea,
    }
    const text = {
      ...TEXT_DEFAULTS,
      ...textArea.text,
    }

    const fullTextArea = {
      ...textArea,
      text,
      at: getTextAreaLocation.uTurn(uturn),
    }
    drawTextAreaMatte(ctx)(fullTextArea);
    queueMicrotask(() => drawText(ctx)(fullTextArea));
  },
})

export const getTextAreaDimension = (textArea: DeepRequired<TextArea>) => ({
  width: textArea.text.fontSize * 2,
  height: textArea.text.fontSize * 2,
});

export const drawTextAreaMatte = (ctx: CanvasRenderingContext2D) => (textArea: DeepRequired<TextArea>) => {
  const { width, height } = getTextAreaDimension(textArea);
  drawShape(ctx).drawSquare({
    at: { x: textArea.at.x, y: textArea.at.y },
    width,
    height,
    color: textArea.color,
  })
}

export const drawText = (ctx: CanvasRenderingContext2D) => (textArea: DeepRequired<TextArea>) => {
  const { at } = textArea;
  const { content, fontSize, fontWeight, color } = textArea.text;

  ctx.font = `${fontWeight} ${fontSize}px Arial`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(content, at.x + fontSize, at.y + fontSize);
}

/**
 * given a shape that supports the text area api, get back the full text area with the location
 *
 * @example getTextAreaLocation.line(line)
 */
export const getTextAreaLocation = {
  line: (line: Line) =>  getTextAreaLocationOnLine(line),
  arrow: (arrow: Arrow) => getTextAreaLocationOnArrow(arrow),
  uTurn: (uTurn: UTurnArrow) => getTextAreaLocationOnUTurnArrow(uTurn),
}