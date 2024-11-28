import { TEXT_DEFAULTS, TEXTAREA_DEFAULTS } from "@shape/types";
import type { Coordinate, TextArea, TextAreaNoLocation } from "@shape/types";
import type { DeepRequired } from "@utils/types";
import { rect } from "./rect";

export const getTextAreaDimension = (textArea: DeepRequired<TextArea>) => ({
  width: Math.max(
    textArea.text.fontSize * 0.6 * textArea.text.content.length,
    textArea.text.fontSize * 2
  ),
  height: textArea.text.fontSize * 2, // will need to be extended if text wrap
});

export const drawTextMatteWithTextArea = (textArea: DeepRequired<TextArea>) => {
  const { color, at } = textArea;
  const { width, height } = getTextAreaDimension(textArea);
  const matte = rect({
    at,
    width,
    height,
    color,
  });
  return (ctx: CanvasRenderingContext2D) => matte.drawShape(ctx);
};

export const drawTextWithTextArea = (textArea: DeepRequired<TextArea>) => (ctx: CanvasRenderingContext2D) => {
    const { at } = textArea;
    const { content, fontSize, fontWeight, color } = textArea.text;

    ctx.font = `${fontWeight} ${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const { width } = getTextAreaDimension({
      ...textArea,
      at,
    } as DeepRequired<TextArea>);
    
    const textVerticalOffset = fontSize >= 50 ? 0.3 : 0.1;
    
    ctx.fillText(
      content,
      at.x + width / 2,
      at.y + fontSize + fontSize ** textVerticalOffset
    );
  };

export const getFullTextArea = (
  textAreaInput: TextAreaNoLocation,
  at: Coordinate
) => {
  const textArea = {
    ...TEXTAREA_DEFAULTS,
    ...textAreaInput,
  };

  const text = {
    ...TEXT_DEFAULTS,
    ...textArea.text,
  };

  const { width } = getTextAreaDimension({
    ...textArea,
    at,
  } as DeepRequired<TextArea>);

  const fullTextArea = {
    ...textArea,
    text,
    at: { x: at.x - width / 2 + text.fontSize, y: at.y },
  };

  return fullTextArea;
};
