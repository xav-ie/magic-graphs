import type { Image } from '.';
import {
  drawTextAreaOnRect,
  drawTextAreaMatteOnRect,
  drawTextOnRect,
  getTextAreaLocationOnRect,
  rectTextHitbox,
} from '@shape/rect/text';

export const getTextAreaLocationOnImage = (image: Image) => {
  return getTextAreaLocationOnRect(image);
};

/**
 * @description checks if the point is in the text label of the image
 *
 * @param point - the point to check if it is in the image
 * @returns a function that checks if the point is in the image
 */
export const imageTextHitbox = (image: Image) => {
  if (!image.textArea) return;

  return rectTextHitbox(image);
};

export const drawTextAreaMatteOnImage = (image: Image) => {
  if (!image.textArea) return;

  return drawTextAreaMatteOnRect(image);
};

export const drawTextOnImage = (image: Image) => {
  if (!image.textArea) return;

  return drawTextOnRect(image);
};

export const drawTextAreaOnImage = (image: Image) => {
  if (!image.textArea) return;

  return drawTextAreaOnRect(image);
};
