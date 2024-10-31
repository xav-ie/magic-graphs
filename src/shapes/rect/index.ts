import type { Text, Stroke, Coordinate, Shape } from "@shape/types"
import { rectHitbox } from "./hitbox"
import { drawRectWithCtx } from "./draw"
import { generateId } from "@graph/helpers"

export type Rect = {
  at: Coordinate,
  width: number,
  height: number,
  color?: string,
  stroke?: Stroke,
  text?: Text
}

export const RECT_DEFAULTS = {
  color: 'black',
} as const

export const rect = (options: Rect): Shape => {
  const draw = drawRectWithCtx(options)
  const hitbox = rectHitbox(options)
  return {
    id: generateId(),
    name: 'rect',
    draw,
    hitbox
  }
}