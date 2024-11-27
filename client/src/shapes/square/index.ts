import type {
  Coordinate,
  Shape,
  Stroke,
  TextAreaNoLocation
} from "@shape/types"
import { drawSquareWithCtx } from "./draw"
import {
  squareTextHitbox,
  drawTextAreaOnSquare,
  drawTextAreaMatteOnSquare,
  drawTextOnSquare,
  getTextAreaLocationOnSquare
} from './text'
import { squareHitbox, squareEfficientHitbox, getSquareBoundingBox } from "./hitbox"
import { generateId } from "@graph/helpers"
import { getFullTextArea } from "@shape/text";
import { engageTextarea } from "@shape/textarea";

export type Square = {
  id?: string
  at: Coordinate
  size: number
  color?: string
  stroke?: Stroke
  textArea?: TextAreaNoLocation
  borderRadius?: number
  rotation?: number
}

/**
 * squares use rect default values
 */
export const square = (options: Square): Shape => {
  const drawShape = drawSquareWithCtx(options);

  const shapeHitbox = squareHitbox(options);
  const textHitbox = squareTextHitbox(options);
  const efficientHitbox = squareEfficientHitbox(options);
  const hitbox = (point: Coordinate) => {
    return textHitbox?.(point) || shapeHitbox(point)
  }

  const getBoundingBox = getSquareBoundingBox(options);

  const drawTextArea = drawTextAreaOnSquare(options);

  const drawTextAreaMatte = drawTextAreaMatteOnSquare(options);
  const drawText = drawTextOnSquare(options);

  const draw = (ctx: CanvasRenderingContext2D) => {
    drawShape(ctx);
    drawTextArea?.(ctx);
  }

  const activateTextArea = (ctx: CanvasRenderingContext2D, handler: (str: string) => void) => {
    if (!options.textArea) return;
    const location = getTextAreaLocationOnSquare(options);
    const fullTextArea = getFullTextArea(options.textArea, location);
    engageTextarea(ctx, fullTextArea, handler);
  }

  return {
    id: options.id ?? generateId(),
    name: 'square',

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