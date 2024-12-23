import type { TextAreaNoLocation } from "@shape/types";
import tinycolor from "tinycolor2";
import { getMapper } from "./utils";
import { SEQ } from "./edgeSeq";

export const animateTextArea = (progress: number) => (textArea: TextAreaNoLocation | undefined) => {
  if (!textArea) return undefined
  const bgColor = textArea.color;
  const textColor = textArea.text.color;
  if (!bgColor || !textColor) return textArea;

  const mapper = getMapper(...SEQ.TEXT_AREA)
  const opacity = mapper(progress)

  const adjustOpacity = (color: string) => tinycolor(color).setAlpha(opacity).toRgbString()

  const bgColorWithOpacity = adjustOpacity(bgColor)
  const textColorWithOpacity = adjustOpacity(textColor)

  return {
    ...textArea,
    color: bgColorWithOpacity,
    text: {
      ...textArea.text,
      color: textColorWithOpacity,
    },
  }
}