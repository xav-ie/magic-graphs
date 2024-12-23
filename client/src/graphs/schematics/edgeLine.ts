import { arrow, line } from "@shapes";
import type { Arrow } from "@shape/arrow";
import gsap from "gsap";
import { EASING_FUNCTIONS } from "@utils/animate";
import type { TextAreaNoLocation } from "@shape/types";
import tinycolor from "tinycolor2";
import { DURATION_MS } from "@graph/animationController";
import type { ShapeResolverOptions } from "./types";
import type { Line } from "@shape/line";

const { interpolate, normalize, mapRange } = gsap.utils

// from 0 to 0.75 is the arrow body sequence
const BODY_SEQUENCE = [0, 0.9] as const
// from 0.75 to 1 is the text area sequence
const TEXT_AREA_SEQUENCE = [0.9, 1] as const
// after 1, the animation is done

const getMapper = (startSeq: number, endSeq: number) => {
  return mapRange(DURATION_MS * startSeq, DURATION_MS * endSeq, 0, 1)
}

const inRange = (start: number, end: number, value: number) => {
  return value >= start && value <= end
}

const animateTextArea = (progress: number) => (textArea: TextAreaNoLocation | undefined) => {
  if (!textArea) return undefined
  const bgColor = textArea.color;
  const textColor = textArea.text.color;
  if (!bgColor || !textColor) return textArea;

  const mapper = getMapper(...TEXT_AREA_SEQUENCE)
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

/**
 * returns the ending coordinates of the arrow body
 */
const animateArrowBody = (progress: number) => (lineSchema: Arrow): Partial<Line> => {
  const easing = EASING_FUNCTIONS["in-out"]
  const mapper = getMapper(...BODY_SEQUENCE)
  const percentage = easing(mapper(progress))

  const interpolateWidth = interpolate(0, lineSchema.width)

  return {
    width: interpolateWidth(percentage),
  }
}

const animatedLine = (progress: number) => (lineSchema: Line) => {
  const percent = normalize(0, DURATION_MS, progress)

  if (inRange(BODY_SEQUENCE[0], BODY_SEQUENCE[1], percent)) {
    return line({
      ...lineSchema,
      ...animateArrowBody(progress)(lineSchema),
      textArea: undefined,
    })
  }

  if (inRange(TEXT_AREA_SEQUENCE[0], TEXT_AREA_SEQUENCE[1], percent)) {
    return line({
      ...lineSchema,
      textArea: animateTextArea(progress)(lineSchema.textArea),
    })
  }

  return line(lineSchema)
}

export const edgeLine = ({
  controller,
  id,
}: ShapeResolverOptions) => (arrowSchema: Line) => {
  const { itemsAnimatingIn, itemsAnimatingOut } = controller

  const inProgress = itemsAnimatingIn.get(id)
  const outProgress = itemsAnimatingOut.get(id)
  if (inProgress !== undefined) return animatedLine(inProgress)(arrowSchema)
  return line(arrowSchema)
}