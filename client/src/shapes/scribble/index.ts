import type {
  Coordinate,
  Shape,
} from "@shape/types";
import { drawScribbleWithCtx } from "./draw";
// import { scribbleHitbox, scribbleEfficientHitbox, getScribbleBoundingBox } from "./hitbox";
import { generateId } from "@graph/helpers";

export type Scribble = {
  type: "draw" | "erase";
  color?: string;
  brushWeight?: number;
  points: Coordinate[];
};

export const SCRIBBLE_DEFAULTS = {
  color: "red",
  brushWeight: 3,
} as const

export const ERASER_BRUSH_WEIGHT = 50

export const scribble = (options: Scribble): Shape => {

  if (options.points.length < 1) {
    throw new Error('not enough points to draw scribble')
  }
  if (options.brushWeight && options.brushWeight < 1) {
    throw new Error('brushWeight must be at least "1"')
  }

  
  // const shapeHitbox = scribbleHitbox(options);
  // const efficientHitbox = scribbleEfficientHitbox(options)
  // const hitbox = (point: Coordinate) => {
  //   return shapeHitbox(point)
  // }
  
  // const getBoundingBox = getScribbleBoundingBox(options);
  
  const drawShape = drawScribbleWithCtx(options);

  const draw = (ctx: CanvasRenderingContext2D) => {
    drawShape(ctx);
  }

  

  return {
    id: generateId(),
    name: 'scribble',

    drawShape,
    draw,

    // hitbox,
    // shapeHitbox,
    // efficientHitbox,
    // getBoundingBox,
  }
}