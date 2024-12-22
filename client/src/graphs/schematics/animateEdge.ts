import { arrow } from "@shapes";
import type { Arrow } from "@shape/arrow";
import gsap from "gsap";
import { EASING_FUNCTIONS } from "@utils/animate";
import type { TextAreaNoLocation } from "@shape/types";
import tinycolor from "tinycolor2";

const DURATION_MS = 1250

const { interpolate, normalize, mapRange } = gsap.utils

let progress = 0
for (let i = 0; i <= DURATION_MS; i++) {
  setTimeout(() => {
    progress = i
  }, 1 * i)
}

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

const animateTextArea = (textArea: TextAreaNoLocation | undefined) => {
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
const animateArrowBody = (arrowSchema: Arrow): Partial<Arrow> => {
  const easing = EASING_FUNCTIONS["in-out"]
  const mapper = getMapper(...BODY_SEQUENCE)
  const percentage = easing(mapper(progress))

  const interpolateCoords = interpolate(arrowSchema.start, arrowSchema.end)
  const interpolateWidth = interpolate(0, arrowSchema.width)

  return {
    end: interpolateCoords(percentage),
    width: interpolateWidth(percentage),
  }
}

export const animatedArrow = (arrowSchema: Arrow) => {
  const percent = normalize(0, DURATION_MS, progress)

  if (inRange(BODY_SEQUENCE[0], BODY_SEQUENCE[1], percent)) {
    return arrow({
      ...arrowSchema,
      ...animateArrowBody(arrowSchema),
      textArea: undefined,
    })
  }

  if (inRange(TEXT_AREA_SEQUENCE[0], TEXT_AREA_SEQUENCE[1], percent)) {
    return arrow({
      ...arrowSchema,
      textArea: animateTextArea(arrowSchema.textArea),
    })
  }

  return arrow(arrowSchema)
}