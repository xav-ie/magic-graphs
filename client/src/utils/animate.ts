import type { Coordinate } from "@shape/types";
import tinycolor from "tinycolor2";

/**
 *
 * @param {number} duration in milliseconds
 * @param {number} frameRate in frames per second
 * @returns {number} number of steps
 */
export const calculateSteps = (
  duration = 1000,
  frameRate = 60,
) => {
  const seconds = duration / 1000;
  return Math.floor(frameRate * seconds);
};

export type EasingFunction =
  | "linear"
  | "in-out"
  | "in"
  | "out"
  /**
   * @param {number} progress the current progress
   * @returns {number} the new progress
   */
  | ((progress: number) => number);

/**
 *
 * @param {number} progress the current progress
 * @param {EasingFunction} ease the easing function
 */
export const easeFunction = (progress: number, ease: EasingFunction) => {
  if (typeof ease === "function") return ease(progress);

  switch (ease) {
    case "linear":
      return progress;
    case "in":
      return progress * progress;
    case "out":
      return progress * (2 - progress);
    case "in-out":
      return progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;
    default:
      throw new Error("invalid easing function");
  }
};

/**
 * gets an intermediate color value between two colors.
 *
 * @param startColor - CSS color string of the start color.
 * @param endColor - CSS color string of the end color.
 * @param progress - Number between 0 and 1.
 * @returns tinycolor instance representing the interpolated color.
 */
export const interpolateColor = (
  startColor: string,
  endColor: string,
  progress: number
) => {
  const start = tinycolor(startColor);
  const end = tinycolor(endColor);

  if (!start.isValid || !end.isValid) {
    throw new Error("Invalid color provided");
  }

  const startRgb = start.toRgb();
  const endRgb = end.toRgb();

  const r = startRgb.r + (endRgb.r - startRgb.r) * progress;
  const g = startRgb.g + (endRgb.g - startRgb.g) * progress;
  const b = startRgb.b + (endRgb.b - startRgb.b) * progress;

  return tinycolor({ r: Math.round(r), g: Math.round(g), b: Math.round(b) });
};

/**
 *
 * @param {number} startPosition the start position of the element
 * @param {number} endPosition the end position of the element
 * @param {number} steps the number of steps to get from `startPosition` to `endPosition`
 * @param {EasingFunction} easing the easing function
 * @returns {Coordinate[]} list of coordinates following the `easing` function between `startPosition` and `endPosition`
 *
 * @example
 * pointInterpolation({ x: 0, y: 0 }, { x: 100, y: 50 }, 5, 'linear')
 * // returns
 * // {x: 20, y: 10}
 * // {x: 40, y: 20}
 * // {x: 60, y: 30}
 * // {x: 80, y: 40}
 * // {x: 100, y: 50}
 */
export const pointInterpolation = (
  startPosition: Coordinate,
  endPosition: Coordinate,
  steps: number,
  easing: EasingFunction = "linear"
) => {
  if (steps < 1) throw new Error("Steps must be greater than 0");
  if (steps % 1 !== 0) throw new Error("Step must be integer");

  const result: Coordinate[] = [];

  for (let i = 1; i <= steps; i++) {
    const progress = i / steps;
    const easedProgress = easeFunction(progress, easing);

    const x = Math.round(
      startPosition.x + (endPosition.x - startPosition.x) * easedProgress
    );
    const y = Math.round(
      startPosition.y + (endPosition.y - startPosition.y) * easedProgress
    );

    result.push({ x, y });
  }

  return result;
};
