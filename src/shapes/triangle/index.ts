import { generateId } from "@graph/helpers"
import type { Coordinate, Shape } from "@shape/types"
import { triangleHitbox } from "./hitbox"
import { drawTriangleWithCtx } from "./draw"

export type Triangle = {
  point1: Coordinate,
  point2: Coordinate,
  point3: Coordinate,
  color?: string,
}

export const TRIANGLE_DEFAULTS = {
  color: 'black',
} as const

export const triangle = (options: Triangle): Shape => {
  const draw = drawTriangleWithCtx(options)
  const hitbox = triangleHitbox(options)
  return {
    id: generateId(),
    name: 'triangle',
    draw,
    hitbox,
  }
}