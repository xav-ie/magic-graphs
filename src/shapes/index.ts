import { arrow as arrowAPI } from "./arrow";
import { circle as circleAPI } from "./circle";
import { line as lineAPI } from "./line";
import { rect as rectAPI } from "./rect";
import { square as squareAPI } from "./square";
import { triangle as triangleAPI } from "./triangle";
import { uturn as uturnAPI } from "./uturn";

export const line = lineAPI;
export const arrow = arrowAPI;
export const circle = circleAPI;
export const rect = rectAPI;
export const square = squareAPI;
export const triangle = triangleAPI;
export const uturn = uturnAPI;

export const shapes = {
  arrow,
  circle,
  line,
  rect,
  square,
  triangle,
  uturn,
};