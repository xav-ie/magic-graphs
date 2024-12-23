import { arrow } from "@shapes";
import type { Arrow } from "@shape/arrow";
import gsap from "gsap";
import { EASING_FUNCTIONS } from "@utils/animate";
import { DURATION_MS } from "@graph/animationController";
import type { ShapeResolverOptions } from "./types";
import { SEQ } from "./edgeSeq";
import { getMapper, inRange } from "./utils";
import { animateInTextArea, animateOutTextArea } from "./edgeTextArea";

const { interpolate, normalize } = gsap.utils
const EASING = EASING_FUNCTIONS["in-out"]

const animateInArrowBody = (progress: number) => (arrowSchema: Arrow): Partial<Arrow> => {
  const mapper = getMapper(...SEQ.IN.BODY)
  const percentage = EASING(mapper(progress))

  const interpolateCoords = interpolate(arrowSchema.start, arrowSchema.end)
  const interpolateWidth = interpolate(0, arrowSchema.width)

  return {
    end: interpolateCoords(percentage),
    width: interpolateWidth(percentage),
  }
}

const animateOutArrowBody = (progress: number) => (arrowSchema: Arrow): Partial<Arrow> => {
  const mapper = getMapper(...SEQ.OUT.BODY)
  const percentage = EASING(mapper(progress))

  const interpolateWidth = interpolate(arrowSchema.width, 0)

  return {
    width: interpolateWidth(percentage),
  }
}

const inArrow = (progress: number) => (arrowSchema: Arrow) => {
  const percent = normalize(0, DURATION_MS, progress)

  if (inRange(SEQ.IN.BODY[0], SEQ.IN.BODY[1], percent)) {
    return arrow({
      ...arrowSchema,
      ...animateInArrowBody(progress)(arrowSchema),
      textArea: undefined,
    })
  }

  if (inRange(SEQ.IN.TEXT_AREA[0], SEQ.IN.TEXT_AREA[1], percent)) {
    return arrow({
      ...arrowSchema,
      textArea: animateInTextArea(progress)(arrowSchema.textArea),
    })
  }

  return arrow(arrowSchema)
}

const outArrow = (progress: number) => (arrowSchema: Arrow) => {
  const percent = normalize(0, DURATION_MS, progress)

  if (inRange(SEQ.OUT.TEXT_AREA[0], SEQ.OUT.TEXT_AREA[1], percent)) {
    return arrow({
      ...arrowSchema,
      textArea: animateOutTextArea(progress)(arrowSchema.textArea),
    })
  }

  if (inRange(SEQ.OUT.BODY[0], SEQ.OUT.BODY[1], percent)) {
    return arrow({
      ...arrowSchema,
      ...animateOutArrowBody(progress)(arrowSchema),
      textArea: undefined,
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
  if (inProgress !== undefined) return inArrow(inProgress)(arrowSchema)

  const outProgress = itemsAnimatingOut.get(id)
  if (outProgress !== undefined) return outArrow(outProgress)(arrowSchema)

  return arrow(arrowSchema)
}