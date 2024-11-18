import { generateId } from "@graph/helpers"
import type {
  Coordinate,
  Shape,
  TextAreaNoLocation
} from "@shape/types"
import { drawUTurnWithCtx } from "./draw"
import { uturnHitbox, uturnEfficientHitbox, getUturnBoundingBox } from "./hitbox"
import {
  drawTextAreaMatteOnUTurn,
  drawTextAreaOnUTurn,
  drawTextOnUTurn,
  getTextAreaLocationOnUTurn,
  uturnTextHitbox
} from "./text"
import { getFullTextArea } from "@shape/text"
import { engageTextarea } from "@shape/textarea"

export type UTurn = {
  spacing: number,
  at: Coordinate,
  upDistance: number,
  downDistance: number,
  rotation: number,
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

  const shapeHitbox = uturnHitbox(options);
  const textHitbox = uturnTextHitbox(options);
  const efficientHitbox = uturnEfficientHitbox(options)
  const hitbox = (point: Coordinate) => {
    return textHitbox?.(point) || shapeHitbox(point)
  }

  const getBoundingBox = getUturnBoundingBox(options);

  const drawTextArea = drawTextAreaOnUTurn(options);

  const drawTextAreaMatte = drawTextAreaMatteOnUTurn(options);
  const drawText = drawTextOnUTurn(options);

  const draw = (ctx: CanvasRenderingContext2D) => {
    drawShape(ctx);
    drawTextArea?.(ctx);
  }

  const activateTextArea = (handler: (str: string) => void) => {
    if (!options.textArea) return;
    const location = getTextAreaLocationOnUTurn(options);
    const fullTextArea = getFullTextArea(options.textArea, location);
    engageTextarea(fullTextArea, handler);
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
    shapeHitbox,
    textHitbox,
    efficientHitbox,
    getBoundingBox,

    activateTextArea,
  }
}