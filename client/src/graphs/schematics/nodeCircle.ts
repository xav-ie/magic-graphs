import gsap from "gsap"
import type { Circle } from "@shape/circle";
import type { ShapeResolverOptions } from "./types";
import { circle } from "@shapes";
import { getMapper } from "./utils";
import { EASING_FUNCTIONS } from "@utils/animate";

const { interpolate } = gsap.utils
const EASING = EASING_FUNCTIONS["in-out"]

const animateInCircleBody = (progress: number) => (circleSchema: Circle): Partial<Circle> => {
  const mapper = getMapper(0, 1)
  const percentage = EASING(mapper(progress))

  const interpolateRadius = interpolate(0, circleSchema.radius)

  return {
    radius: interpolateRadius(percentage),
  }
}

const animateOutCircleBody = (progress: number) => (circleSchema: Circle): Partial<Circle> => {
  const mapper = getMapper(0, 1)
  const percentage = EASING(mapper(progress))

  const interpolateRadius = interpolate(circleSchema.radius, 0)

  return {
    radius: interpolateRadius(percentage),
  }
}

const animateInCircleText = (progress: number) => (circleSchema: Circle): Partial<Circle> => {
  if (circleSchema.textArea === undefined) return circleSchema
  const mapper = getMapper(0, 1)
  const percentage = EASING(mapper(progress))

  const interpolateFontSize = interpolate(0, circleSchema.textArea.text.fontSize)

  return {
    ...circleSchema,
    textArea: {
      ...circleSchema.textArea,
      text: {
        ...circleSchema.textArea.text,
        fontSize: interpolateFontSize(percentage),
      }
    }
  }
}

const animateOutCircleText = (progress: number) => (circleSchema: Circle): Partial<Circle> => {
  if (circleSchema.textArea === undefined) return circleSchema
  const mapper = getMapper(0, 1)
  const percentage = EASING(mapper(progress))

  const interpolateFontSize = interpolate(circleSchema.textArea.text.fontSize, 0)

  return {
    ...circleSchema,
    textArea: {
      ...circleSchema.textArea,
      text: {
        ...circleSchema.textArea.text,
        fontSize: interpolateFontSize(percentage),
      }
    }
  }
}

const inCircle = (progress: number) => (circleSchema: Circle) => {
  return circle({
    ...circleSchema,
    ...animateInCircleText(progress)(circleSchema),
    ...animateInCircleBody(progress)(circleSchema),
  })
}

const outCircle = (progress: number) => (circleSchema: Circle) => {
  return circle({
    ...circleSchema,
    ...animateOutCircleText(progress)(circleSchema),
    ...animateOutCircleBody(progress)(circleSchema),
  })
}

export const nodeCircle = ({
  controller,
  id,
}: ShapeResolverOptions) => (circleSchema: Circle) => {
  const { itemsAnimatingIn, itemsAnimatingOut } = controller

  const inProgress = itemsAnimatingIn.get(id)
  if (inProgress !== undefined) return inCircle(inProgress)(circleSchema)

  const outProgress = itemsAnimatingOut.get(id)
  if (outProgress !== undefined) return outCircle(outProgress)(circleSchema)

  return circle(circleSchema)
}