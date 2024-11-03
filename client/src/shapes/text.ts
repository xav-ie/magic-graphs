import {
  TEXT_DEFAULTS,
  TEXTAREA_DEFAULTS
} from "@shape/types"
import type {
  Coordinate,
  TextArea,
  TextAreaNoLocation
} from "@shape/types";
import type { DeepRequired } from "@utils/types";
import { rect } from "./rect";

export const getTextAreaDimension = (textArea: DeepRequired<TextArea>) => ({
  width: textArea.text.fontSize * 2,
  height: textArea.text.fontSize * 2,
});

export const drawTextMatteWithTextArea = (textArea: DeepRequired<TextArea>) => {
  const { at } = textArea;
  const { width, height } = getTextAreaDimension(textArea);
  const matte = rect({
    at,
    width,
    height,
    color: textArea.color,
  })
  return (ctx: CanvasRenderingContext2D) => matte.drawShape(ctx);
}

export const drawTextWithTextArea = (textArea: DeepRequired<TextArea>) => (ctx: CanvasRenderingContext2D) => {
  const { at } = textArea;
  const {
    content,
    fontSize,
    fontWeight,
    color
  } = textArea.text;

  ctx.font = `${fontWeight} ${fontSize}px Arial`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(content, at.x + fontSize, at.y + fontSize);
}

export const getFullTextArea = (textAreaInput: TextAreaNoLocation, at: Coordinate) => {
  const textArea = {
    ...TEXTAREA_DEFAULTS,
    ...textAreaInput,
  }

  const text = {
    ...TEXT_DEFAULTS,
    ...textArea.text,
  }

  const fullTextArea = {
    ...textArea,
    text,
    at,
  }

  return fullTextArea;
}