import type { Coordinate } from "@shape/types";

/**
 *
 * @param {number} frameRate in frames per second
 * @param {number} duration in miliseconds
 * @returns {number} number of steps
 */

export const calculateSteps = (
  frameRate: number = 60,
  duration: number = 1000
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
 * @returns
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
      return progress;
  }
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
  const result: Coordinate[] = [];

  for (let i = 1; i <= steps; i++) {
    const progress = i / steps;
    const easedProgress = easeFunction(progress, easing);

    const x = Math.round(startPosition.x + (endPosition.x - startPosition.x) * easedProgress);
    const y = Math.round(startPosition.y + (endPosition.y - startPosition.y) * easedProgress);

    result.push({ x, y });
  }

  return result;
};
