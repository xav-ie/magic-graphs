import type { Coordinate } from "./types"

/**
 * @description rotates a point around a center point by a given angle in radians
 *
 * @param pointToRotate - the point that is to be rotated
 * @param centerPoint - the point that the pointToRotate will rotate around
 * @param angle - the angle in radians that the pointToRotate will rotate by
 * @returns the new point after rotation
 */
const rotatePoint = (pointToRotate: Coordinate, centerPoint: Coordinate, angle: number) => {
  const cosA = Math.cos(angle)
  const sinA = Math.sin(angle)
  const dx = pointToRotate.x - centerPoint.x
  const dy = pointToRotate.y - centerPoint.y

  return {
    x: centerPoint.x + (dx * cosA - dy * sinA),
    y: centerPoint.y + (dx * sinA + dy * cosA)
  }
}

/**
 * @description calculates the angle between two points in radians
 *
 * @param point1 - the first point
 * @param point2 - the second point
 * @returns the angle between the two points in radians
 */
export const calculateAngle = (point1: Coordinate, point2: Coordinate) => {
  const { x: x1, y: y1 } = point1
  const { x: x2, y: y2 } = point2
  return Math.atan2(y2 - y1, x2 - x1)
}