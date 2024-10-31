import type { Coordinate, Stroke, Text, Shape } from "@shape/types"
import { drawCircleWithCtx } from "@shape/circle/draw";
import { circleHitbox } from "./hitbox";
import { generateId } from "@graph/helpers";

export type Circle = {
  at: Coordinate,
  radius: number,
  color?: string,
  stroke?: Stroke,
  text?: Text
}

export const CIRCLE_DEFAULTS = {
  color: 'black',
} as const

export const circle = (options: Circle): Shape => {
  const draw = drawCircleWithCtx(options);
  const hitbox = circleHitbox(options);
  return {
    id: generateId(),
    name: 'circle',
    draw,
    hitbox
  }
}