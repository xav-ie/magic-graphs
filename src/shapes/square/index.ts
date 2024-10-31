import type { Coordinate, Shape, Stroke, Text } from "@shape/types"
import { drawSquareWithCtx } from "./draw"
import { squareHitbox } from "./hitbox"
import { generateId } from "@graph/helpers"

export type Square = {
  at: Coordinate,
  size: number,
  stroke?: Stroke,
  text?: Text,
}

/**
 * squares use rect default values
 */
export const square = (options: Square): Shape => {
  const draw = drawSquareWithCtx(options)
  const hitbox = squareHitbox(options)
  return {
    id: generateId(),
    name: 'square',
    draw,
    hitbox,
  }
}