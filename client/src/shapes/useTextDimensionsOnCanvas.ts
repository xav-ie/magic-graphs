import { getCtx } from "@utils/ctx";
import { TEXT_DEFAULTS, type Text } from "./types";

export const useTextDimensionOnCanvas = () => {
  const canvas = document.createElement("canvas");
  const ctx = getCtx(canvas);
  canvas.width = 1;
  canvas.height = 1;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const getTextDimensionsOnCanvas = (text: Text) => {
    const { content, fontSize, fontWeight, fontFamily } = {
      ...TEXT_DEFAULTS,
      ...text,
    };

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    const metrics = ctx.measureText(content);

    const ascent = metrics.actualBoundingBoxAscent;
    const descent = metrics.actualBoundingBoxDescent;
    const height = ascent + descent;

    return {
      width: metrics.width,
      height,
      ascent,
      descent,
    };
  };

  canvas.remove();

  return {
    getTextDimensionsOnCanvas,
  };
};
