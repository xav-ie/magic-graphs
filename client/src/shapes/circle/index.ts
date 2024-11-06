import type {
  Coordinate,
  Stroke,
  TextAreaNoLocation,
  Shape,
} from "@shape/types"
import { drawCircleWithCtx } from "@shape/circle/draw";
import { circleHitbox } from "./hitbox";
import {
  circleTextHitbox,
  drawTextAreaOnCircle,
  drawTextAreaMatteOnCircle,
  drawTextOnCircle,
  getTextAreaLocationOnCircle
} from './text'
import { generateId } from "@graph/helpers";
import { getFullTextArea } from "@shape/text";
import { engageTextarea } from "@shape/textarea";

export type Circle = {
  at: Coordinate,
  radius: number,
  color?: string,
  stroke?: Stroke,
  textArea?: TextAreaNoLocation,
}

export const CIRCLE_DEFAULTS = {
  color: 'black',
} as const

export const circle = (options: Circle): Shape => {

  if (options.radius < 0) {
    throw new Error('radius must be positive')
  }
  
  const drawShape = drawCircleWithCtx(options);

  const shapeHitbox = circleHitbox(options);
  const textHitbox = circleTextHitbox(options);
  const hitbox = (point: Coordinate) => {
    return textHitbox?.(point) || shapeHitbox(point)
  }


  const drawTextArea = drawTextAreaOnCircle(options);

  const drawTextAreaMatte = drawTextAreaMatteOnCircle(options);
  const drawText = drawTextOnCircle(options);

  const draw = (ctx: CanvasRenderingContext2D) => {
    drawShape(ctx);
    drawTextArea?.(ctx);
  }

  const activateTextArea = (handler: (str: string) => void) => {
    if (!options.textArea) return;
    const location = getTextAreaLocationOnCircle(options);
    const fullTextArea = getFullTextArea(options.textArea, location);
    engageTextarea(fullTextArea, handler);
  }

  return {
    id: generateId(),
    name: 'circle',

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