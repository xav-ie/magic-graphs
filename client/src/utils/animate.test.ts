import { describe, it, expect } from 'vitest';
import { interpolateCoordinates } from './animate';

describe('pointInterpolation', () => {
  const startPosition = { x: 0, y: 0 };
  const endPosition = { x: 10, y: 10 };

  it("returns correct number of steps with 'linear' easing function", () => {
    const result = interpolateCoordinates({
      start: startPosition,
      end: endPosition,
      numberOfSteps: 5,
      easeFn: 'linear',
    });

    expect(result.length).toBe(5);
  });

  it("interpolates correctly with 'linear' easing function", () => {
    const result = interpolateCoordinates({
      start: startPosition,
      end: endPosition,
      numberOfSteps: 4,
      easeFn: 'linear',
    });
    expect(result).toEqual([
      { x: 3, y: 3 },
      { x: 5, y: 5 },
      { x: 8, y: 8 },
      { x: 10, y: 10 },
    ]);
  });

  it("interpolates correctly with 'in' easing function", () => {
    const result = interpolateCoordinates({
      start: startPosition,
      end: endPosition,
      numberOfSteps: 3,
      easeFn: 'in',
    });

    expect(result).toEqual([
      { x: 1, y: 1 },
      { x: 4, y: 4 },
      { x: 10, y: 10 },
    ]);
  });

  it("interpolates correctly with 'out' easing function", () => {
    const result = interpolateCoordinates({
      start: startPosition,
      end: endPosition,
      numberOfSteps: 3,
      easeFn: 'out',
    });

    expect(result).toEqual([
      { x: 6, y: 6 },
      { x: 9, y: 9 },
      { x: 10, y: 10 },
    ]);
  });

  it("interpolates correctly with 'in-out' easing function", () => {
    const result = interpolateCoordinates({
      start: startPosition,
      end: endPosition,
      numberOfSteps: 4,
      easeFn: 'in-out',
    });

    expect(result).toEqual([
      { x: 1, y: 1 },
      { x: 5, y: 5 },
      { x: 9, y: 9 },
      { x: 10, y: 10 },
    ]);
  });

  it('interpolates correctly with custom easing function', () => {
    const result = interpolateCoordinates({
      start: startPosition,
      end: endPosition,
      numberOfSteps: 3,
      easeFn: (n) => n ** 3,
    });

    expect(result).toEqual([
      { x: 0, y: 0 },
      { x: 3, y: 3 },
      { x: 10, y: 10 },
    ]);
  });

  it('handles edge case: numberOfSteps = 1', () => {
    const result = interpolateCoordinates({
      start: startPosition,
      end: endPosition,
      numberOfSteps: 1,
      easeFn: 'linear',
    });

    expect(result).toEqual([{ x: 10, y: 10 }]);
  });

  it('handles edge case: start = end', () => {
    const result = interpolateCoordinates({
      start: { x: 5, y: 5 },
      end: { x: 5, y: 5 },
      numberOfSteps: 3,
    });

    expect(result).toEqual(Array(3).fill({ x: 5, y: 5 }));
  });

  it('throws if numberOfSteps is not an integer', () => {
    expect(() =>
      interpolateCoordinates({
        start: startPosition,
        end: endPosition,
        numberOfSteps: 1.5,
      }),
    ).toThrow();
  });
});
