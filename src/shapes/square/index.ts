import type {
  Coordinate,
  Shape,
  Stroke,
  Text
} from "@shape/types"
import { drawSquareWithCtx } from "./draw"
import { squareHitbox } from "./hitbox"
import { generateId } from "@graph/helpers"

export type Square = {
  at: Coordinate,
  size: number,
  color?: string,
  stroke?: Stroke,
  text?: Text,
}

/**
 * squares use rect default values
 */
export const square = (options: Square): Shape => {
  const drawShape = drawSquareWithCtx(options)
  const hitbox = squareHitbox(options)

  const draw = (ctx: CanvasRenderingContext2D) => {
    drawShape(ctx)
  }

  return {
    id: generateId(),
    name: 'square',

    draw,
    drawShape,

    hitbox,
  }
}