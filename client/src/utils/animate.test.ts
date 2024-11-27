import { describe, it, expect } from "vitest";
import { pointInterpolation } from "./animate";

describe("pointInterpolation", () => {
  const startPosition = { x: 0, y: 0 };
  const endPosition = { x: 10, y: 10 };

  it("should return correct number of steps with linear easing", () => {
    const steps = 5;
    const result = pointInterpolation(startPosition, endPosition, steps, "linear");
    expect(result.length).toBe(steps);
  });

  it("should interpolate correctly with linear easing", () => {
    const steps = 4;
    const result = pointInterpolation(startPosition, endPosition, steps, "linear");
    expect(result).toEqual([
      { x: 3, y: 3 },
      { x: 5, y: 5 },
      { x: 8, y: 8 },
      { x: 10, y: 10 },
    ]);
  });

  it("should interpolate correctly with 'in' easing", () => {
    const steps = 3;
    const result = pointInterpolation(startPosition, endPosition, steps, "in");
    expect(result).toEqual([
      { x: 1, y: 1 },
      { x: 4, y: 4 },
      { x: 10, y: 10 },
    ]);
  });

  it("should interpolate correctly with 'out' easing", () => {
    const steps = 3;
    const result = pointInterpolation(startPosition, endPosition, steps, "out");
    expect(result).toEqual([
      { x: 6, y: 6 },
      { x: 9, y: 9 },
      { x: 10, y: 10 },
    ]);
  });

  it("should interpolate correctly with 'in-out' easing", () => {
    const steps = 4;
    const result = pointInterpolation(startPosition, endPosition, steps, "in-out");
    expect(result).toEqual([
      { x: 1, y: 1 },
      { x: 5, y: 5 },
      { x: 9, y: 9 },
      { x: 10, y: 10 },
    ]);
  });

  it("should use a custom easing function", () => {
    const steps = 3;
    const customEasing = (progress: number) => progress ** 3;
    const result = pointInterpolation(startPosition, endPosition, steps, customEasing);
    expect(result).toEqual([
      { x: 0, y: 0 },
      { x: 3, y: 3 },
      { x: 10, y: 10 },
    ]);
  });

  it("should handle edge case with steps = 1", () => {
    const steps = 1;
    const result = pointInterpolation(startPosition, endPosition, steps);
    expect(result).toEqual([{ x: 10, y: 10 }]);
  });

  it("should handle edge case with start and end position being the same", () => {
    const steps = 5;
    const identicalPosition = { x: 5, y: 5 };
    const result = pointInterpolation(identicalPosition, identicalPosition, steps);
    expect(result).toEqual(Array(steps).fill({ x: 5, y: 5 }));
  });

  it("should throw an error if steps is a float value", () => {
    expect(() => pointInterpolation(startPosition, endPosition, 2.5))
      .toThrow("Step must be integer");
  });
});
