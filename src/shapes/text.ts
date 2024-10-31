import { drawShape } from "@shape/draw";
import type { TextArea } from "@shape/types"
import type { DeepRequired } from "@utils/types";

export const getTextAreaDimension = (textArea: DeepRequired<TextArea>) => ({
  width: textArea.text.fontSize * 2,
  height: textArea.text.fontSize * 2,
});

export const drawTextAreaMatte = (ctx: CanvasRenderingContext2D) => (textArea: DeepRequired<TextArea>) => {
  const { width, height } = getTextAreaDimension(textArea);
  const { at } = textArea;
  drawShape(ctx).drawSquare({
    at,
    width,
    height,
    color: textArea.color,
  })
}

export const drawText = (ctx: CanvasRenderingContext2D) => (textArea: DeepRequired<TextArea>) => {
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