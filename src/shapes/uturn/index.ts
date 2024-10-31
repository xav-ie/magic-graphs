import { generateId } from "@graph/helpers"
import type {
  Coordinate,
  Shape,
  TextAreaNoLocation
} from "@shape/types"
import { drawUTurnWithCtx } from "./draw"
import { uturnHitbox, uturnTextHitbox } from "./hitbox"

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
  const draw = drawUTurnWithCtx(options)
  const hitbox = uturnHitbox(options)
  const textHitbox = uturnTextHitbox(options)
  return {
    id: generateId(),
    name: 'uturn',
    draw,
    hitbox,
    textHitbox,
  }
}