import { line } from "@shapes";
import gsap from "gsap";
import { EASING_FUNCTIONS } from "@utils/animate";
import { DURATION_MS } from "@graph/animationController";
import type { ShapeResolverOptions } from "./types";
import { SEQ } from "./edgeSeq";
import { getMapper, inRange } from "./utils";
import { animateTextArea } from "./edgeTextArea";
import type { Line } from "@shape/line";

const { interpolate, normalize } = gsap.utils

/**
 * returns the ending coordinates of the arrow body
 */
const animateLineBody = (progress: number) => (lineSchema: Line): Partial<Line> => {
  const easing = EASING_FUNCTIONS["in-out"]
  const mapper = getMapper(...SEQ.BODY)
  const percentage = easing(mapper(progress))

  const interpolateWidth = interpolate(0, lineSchema.width)

  return {
    width: interpolateWidth(percentage),
  }
}

const animatedLine = (progress: number) => (lineSchema: Line) => {
  const percent = normalize(0, DURATION_MS, progress)

  if (inRange(SEQ.BODY[0], SEQ.BODY[1], percent)) {
    return line({
      ...lineSchema,
      ...animateLineBody(progress)(lineSchema),
      textArea: undefined,
    })
  }

  if (inRange(SEQ.TEXT_AREA[0], SEQ.TEXT_AREA[1], percent)) {
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
}: ShapeResolverOptions) => (lineSchema: Line) => {
  const { itemsAnimatingIn, itemsAnimatingOut } = controller

  const inProgress = itemsAnimatingIn.get(id)
  const outProgress = itemsAnimatingOut.get(id)
  if (inProgress !== undefined) return animatedLine(inProgress)(lineSchema)
  return line(lineSchema)
}