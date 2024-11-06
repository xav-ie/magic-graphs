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
import { squareHitbox } from "./hitbox"
import { generateId } from "@graph/helpers"
import { getFullTextArea } from "@shape/text";
import { engageTextarea } from "@shape/textarea";

export type Square = {
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
  const hitbox = (point: Coordinate) => {
    return textHitbox?.(point) || shapeHitbox(point)
  }

  const drawTextArea = drawTextAreaOnSquare(options);

  const drawTextAreaMatte = drawTextAreaMatteOnSquare(options);
  const drawText = drawTextOnSquare(options);

  const draw = (ctx: CanvasRenderingContext2D) => {
    drawShape(ctx);
    drawTextArea?.(ctx);
  }

  const activateTextArea = (handler: (str: string) => void) => {
    if (!options.textArea) return;
    const location = getTextAreaLocationOnSquare(options);
    const fullTextArea = getFullTextArea(options.textArea, location);
    engageTextarea(fullTextArea, handler);
  }

  return {
    id: generateId(),
    name: 'square',

    draw,

    drawShape,
    drawTextArea,
    drawTextAreaMatte,
    drawText,

    hitbox,
    shapeHitbox,
    textHitbox,

    activateTextArea,
  }
}