import type {
    Coordinate,
    Shape
  } from "@shape/types"
  import { crossHitbox } from "./hitbox"
  import { drawCrossWithCtx } from "./draw"
  import { LINE_DEFAULTS } from "@shape/line"
  import { generateId } from "@graph/helpers"
  
  export type Cross = {
      at: Coordinate
      size: number
      angle?: number
      color?: string
      lineWidth?: number
      borderRadius?: number
  }

  export const CROSS_DEFAULTS = {
    angle: 0,
    color: 'black',
    lineWidth: LINE_DEFAULTS.width,
    borderRadius: 0,
  } as const
  
  export const cross = (options: Cross): Shape => {

    if (options.lineWidth && options.lineWidth < 0) {
      throw new Error('lineWidth must be positive')
    }
    
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