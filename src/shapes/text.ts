import { drawShape } from "@shape/draw";
import { TEXT_DEFAULTS, TEXTAREA_DEFAULTS, type Coordinate, type TextArea, type TextAreaNoLocation } from "@shape/types"
import type { DeepRequired } from "@utils/types";

export const getTextAreaDimension = (textArea: DeepRequired<TextArea>) => ({
  width: textArea.text.fontSize * 2,
  height: textArea.text.fontSize * 2,
});

export const drawTextMatteWithTextArea = (textArea: DeepRequired<TextArea>) => (ctx: CanvasRenderingContext2D) => {
  const { width, height } = getTextAreaDimension(textArea);
  const { at } = textArea;
  drawShape(ctx).drawSquare({
    at,
    width,
    height,
    color: textArea.color,
  })
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