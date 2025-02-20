import type { TextAreaNoLocation } from '@shape/types';
import tinycolor from 'tinycolor2';
import { getMapper } from './utils';
import { SEQ } from './edgeSeq';

const opacityAdjustedTextArea =
  (opacity: number) => (textArea: TextAreaNoLocation) => {
    const bgColor = textArea.color;
    const textColor = textArea.text.color;
    if (!bgColor || !textColor) return textArea;

    const adjustOpacity = (color: string) =>
      tinycolor(color).setAlpha(opacity).toRgbString();

    const bgColorWithOpacity = adjustOpacity(bgColor);
    const textColorWithOpacity = adjustOpacity(textColor);

    return {
      ...textArea,
      color: bgColorWithOpacity,
      text: {
        ...textArea.text,
        color: textColorWithOpacity,
      },
    };
  };

export const animateInTextArea =
  (progress: number) => (textArea: TextAreaNoLocation | undefined) => {
    if (!textArea) return undefined;

    const mapper = getMapper(...SEQ.IN.TEXT_AREA);
    const opacity = mapper(progress);

    const adjustOpacityOfTextArea = opacityAdjustedTextArea(opacity);
    return adjustOpacityOfTextArea(textArea);
  };

export const animateOutTextArea =
  (progress: number) => (textArea: TextAreaNoLocation | undefined) => {
    if (!textArea) return undefined;

    const mapper = getMapper(0, 1);
    const opacity = 1 - mapper(progress);

    const textColor = textArea.text.color;
    if (!textColor) return textArea;

    const adjustOpacity = (color: string) =>
      tinycolor(color).setAlpha(opacity).toRgbString();

    const textColorWithOpacity = adjustOpacity(textColor);

    return {
      ...textArea,
      text: {
        ...textArea.text,
        color: textColorWithOpacity,
      },
    };
  };
