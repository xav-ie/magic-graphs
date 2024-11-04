import type {
  Coordinate,
  Stroke,
  Text,
  Shape
} from "@shape/types"
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

  if (options.radius < 0) {
    throw new Error('radius must be positive')
  }
  
  const drawShape = drawCircleWithCtx(options);
  const hitbox = circleHitbox(options);

  const draw = (ctx: CanvasRenderingContext2D) => {
    drawShape(ctx);
  }

  return {
    id: generateId(),
    name: 'circle',

    draw,
    drawShape,

    hitbox
  }
}