import type { BoundingBox } from "@shape/types";
import { getCtx } from "@utils/ctx";

export const createImageFromCanvasRegion = (
  canvas: HTMLCanvasElement,
  boundingBox: BoundingBox
): string => {
  const { at, width, height } = boundingBox;
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = getCtx(tempCanvas);

  tempCtx.drawImage(
    canvas,           // Source canvas
    at.x, at.y,       // Source start x, y
    width, height,    // Source width, height
    0, 0,             // Destination start x, y
    width, height     // Destination width, height
  );

  return tempCanvas.toDataURL();
};