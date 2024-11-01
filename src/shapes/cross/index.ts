import type {
    Coordinate,
    Shape
  } from "@shape/types"
  import { crossHitbox } from "./hitbox"
  import { drawCrossWithCtx } from "./draw"
  import { LINE_DEFAULTS } from "@shape/line"
  import { generateId } from "@graph/helpers"
  
  export type Cross = {
      center: Coordinate
      size: number
      angle?: number
      color?: string
      lineWidth?: number
  }

  export const CROSS_DEFAULTS = {
    angle: 0,
    color: 'black',
    lineWidth: LINE_DEFAULTS.width
  } as const
  
  export const cross = (options: Cross): Shape => {
    const drawShape = drawCrossWithCtx(options)
    const hitbox = crossHitbox(options)
  
    const draw = (ctx: CanvasRenderingContext2D) => {
      drawShape(ctx)
    }
  
    return {
      id: generateId(),
      name: 'cross',
  
      draw,
      drawShape,
  
  
      hitbox
    }
  }