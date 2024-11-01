import { generateId } from "@graph/helpers"
import type {
  Coordinate,
  Shape,
  TextAreaNoLocation
} from "@shape/types"
import { drawUTurnWithCtx } from "./draw"
import { uturnHitbox } from "./hitbox"
import {
  drawTextAreaMatteOnUTurn,
  drawTextAreaOnUTurn,
  drawTextOnUTurn,
  uturnTextHitbox
} from "./text"

export type UTurn = {
  spacing: number,
  center: Coordinate,
  upDistance: number,
  downDistance: number,
  angle: number,
  lineWidth: number,
  color?: string,
  textArea?: TextAreaNoLocation
}

export const UTURN_DEFAULTS = {
  color: 'black',
} as const

export const uturn = (options: UTurn): Shape => {

  if (options.downDistance < 0) {
    throw new Error('downDistance must be positive')
  }

  if (options.upDistance < 0) {
    throw new Error('upDistance must be positive')
  }

  const drawShape = drawUTurnWithCtx(options);

  const hitbox = uturnHitbox(options);
  const textHitbox = uturnTextHitbox(options);

  const drawTextArea = drawTextAreaOnUTurn(options);

  const drawTextAreaMatte = drawTextAreaMatteOnUTurn(options);
  const drawText = drawTextOnUTurn(options);

  const draw = (ctx: CanvasRenderingContext2D) => {
    drawShape(ctx);
    drawTextArea?.(ctx);
  }

  return {
    id: generateId(),
    name: 'uturn',

    draw,

    drawShape,
    drawTextArea,
    drawTextAreaMatte,
    drawText,

    hitbox,
    textHitbox,
  }
}