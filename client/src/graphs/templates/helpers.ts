import type { BoundingBox, Coordinate } from '@shape/types';
import { getCtx } from '@utils/ctx';
import { average } from '@utils/math';

export const getAverageCoordinates = (coords: Coordinate[]) => {
  const x = coords.map((coord) => coord.x);
  const y = coords.map((coord) => coord.y);
  return {
    x: average(x),
    y: average(y),
  };
};

export const centerNodesOnOriginCoordinates = <T extends Coordinate>(
  nodes: T[],
  targetOrigin: Coordinate,
) => {
  const averageCoordinates = getAverageCoordinates(nodes);

  const offsetX = targetOrigin.x - averageCoordinates.x;
  const offsetY = targetOrigin.y - averageCoordinates.y;

  for (const node of nodes) {
    node.x += offsetX;
    node.y += offsetY;
  }

  return nodes;
};

export const createImageFromCanvasRegion = (
  canvas: HTMLCanvasElement,
  boundingBox: BoundingBox,
) => {
  const { at, width, height } = boundingBox;
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = getCtx(tempCanvas);

  tempCtx.drawImage(
    canvas, // Source canvas
    at.x,
    at.y, // Source start x, y
    width,
    height, // Source width, height
    0,
    0, // Destination start x, y
    width,
    height, // Destination width, height
  );

  const dataURL = tempCanvas.toDataURL();

  tempCanvas.remove();

  return dataURL;
};
