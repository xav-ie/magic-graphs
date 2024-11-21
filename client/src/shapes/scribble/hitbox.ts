import type { Coordinate, BoundingBox } from "@shape/types";
import type { Scribble } from ".";
import { rectEfficientHitbox, rectHitbox } from "@shape/rect/hitbox";


/**
 * @param point - the point to check if it is in the scribble bounding box
 * @returns a function that checks if the point is in the scribble bounding box
*/
export const scribbleHitbox = (scribble: Scribble) => (point: Coordinate) => {
  if (scribble.type === 'erase') return false

  const { topLeft, bottomRight } = getScribbleBoundingBox(scribble)()

  const width = bottomRight.x - topLeft.x
  const height = bottomRight.y - topLeft.y

  const isInRectHitbox = rectHitbox({
    at: {
      x: topLeft.x,
      y: topLeft.y
    },
    width,
    height
  });

  return isInRectHitbox(point)
};

export const getScribbleBoundingBox = (scribble: Scribble) => () => {
  const {
    points
  } = scribble
  

  let minX = points[0].x;
  let minY = points[0].y;
  let maxX = points[0].x;
  let maxY = points[0].y;

  for (const point of points) {
    if (point.x < minX) minX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.x > maxX) maxX = point.x;
    if (point.y > maxY) maxY = point.y;
  }

  return {
    topLeft: { x: minX, y: minY },
    bottomRight: { x: maxX, y: maxY },
  };
}

export const scribbleEfficientHitbox = (scribble: Scribble) => {
  if (scribble.type === 'erase') return (boxToCheck: BoundingBox) => false

  const { topLeft, bottomRight } = getScribbleBoundingBox(scribble)()

  const width = bottomRight.x - topLeft.x
  const height = bottomRight.y - topLeft.y

  const isInRectEfficientHitbox = rectEfficientHitbox({
    at: {
      x: topLeft.x,
      y: topLeft.y
    },
    width,
    height
  });

  return (boxToCheck: BoundingBox) => isInRectEfficientHitbox(boxToCheck)

};