import { arrow } from "@shapes";
import type { Arrow } from "@shape/arrow";
import gsap from "gsap";
import { EASING_FUNCTIONS } from "@utils/animate";
import { DURATION_MS } from "@graph/animationController";
import type { ShapeResolverOptions } from "./types";
import { SEQ } from "./edgeSeq";
import { getMapper, inRange } from "./utils";
import { animateTextArea } from "./edgeTextArea";

const { interpolate, normalize } = gsap.utils

/**
 * returns the ending coordinates of the arrow body
 */
const animateArrowBody = (progress: number) => (arrowSchema: Arrow): Partial<Arrow> => {
  const easing = EASING_FUNCTIONS["in-out"]
  const mapper = getMapper(...SEQ.BODY)
  const percentage = easing(mapper(progress))

  const interpolateCoords = interpolate(arrowSchema.start, arrowSchema.end)
  const interpolateWidth = interpolate(0, arrowSchema.width)

  return {
    end: interpolateCoords(percentage),
    width: interpolateWidth(percentage),
  }
}

const animatedArrow = (progress: number) => (arrowSchema: Arrow) => {
  const percent = normalize(0, DURATION_MS, progress)

  if (inRange(SEQ.BODY[0], SEQ.BODY[1], percent)) {
    return arrow({
      ...arrowSchema,
      ...animateArrowBody(progress)(arrowSchema),
      textArea: undefined,
    })
  }

  if (inRange(SEQ.TEXT_AREA[0], SEQ.TEXT_AREA[1], percent)) {
    return arrow({
      ...arrowSchema,
      textArea: animateTextArea(progress)(arrowSchema.textArea),
    })
  }

  return arrow(arrowSchema)
}

export const edgeArrow = ({
  controller,
  id,
}: ShapeResolverOptions) => (arrowSchema: Arrow) => {
  const { itemsAnimatingIn, itemsAnimatingOut } = controller

  const inProgress = itemsAnimatingIn.get(id)
  const outProgress = itemsAnimatingOut.get(id)
  if (inProgress !== undefined) return animatedArrow(inProgress)(arrowSchema)
  return arrow(arrowSchema)
}