import type { Coordinate } from "@shape/types";

export type AnnotationOptions = Partial<{
  color: string;
  brushWeight: number;
  eraserBrushWeight: number;
}>;

export type Action = {
  type: "draw" | "erase";
  color: string;
  brushWeight: number;
  points: Coordinate[];
};

export const ANNOTATION_DEFAULTS = {
  color: "red",
  brushWeight: 3,
  eraserBrushWeight: 50,
};