
import type { Coordinate } from "@shape/types";
import colors from "@utils/colors";

export type AnnotationOptions = Partial<{
  color: string;
  brushWeight: number;
  eraserBrushWeight: number;
}>;

export type DrawAction = {
  type: "draw";
  color: string;
  brushWeight: number;
  points: Coordinate[];
}

export type EraseAction = {
  type: "erase";
  brushWeight: number;
  points: Coordinate[];
}

export type Action = DrawAction | EraseAction;

export const COLORS = [
  colors.RED_600,
  colors.BLUE_600,
  colors.GREEN_600,
  colors.YELLOW_600,
];

export const BRUSH_WEIGHTS = [1, 3, 5, 7];

export const ANNOTATION_DEFAULTS = {
  color: COLORS[0],
  brushWeight: BRUSH_WEIGHTS[0],
  eraserBrushWeight: 50,
};
