import type { Coordinate, BoundingBox } from "@shape/types";
import type { Rect } from ".";
import { RECT_DEFAULTS } from "."
import { circleHitbox } from "@shape/circle/hitbox";
import { rotatePoint } from "@shape/helpers";

/**
 * @param point - the point to check if it is in the rotated rectangle
 * @returns a function that checks if the point is in the rotated rectangle with rounded corners
 */
export const rectHitbox = (rectangle: Rect) => (point: Coordinate) => {
  const {
    at,
    width,
    height,
    borderRadius,
    rotation,
  } = {
    ...RECT_DEFAULTS,
    ...rectangle
  };

  const centerX = at.x + width / 2;
  const centerY = at.y + height / 2;

  const localPoint = rotatePoint(point, { x: centerX, y: centerY }, -rotation);

  const { x, y } = { x: centerX - width / 2, y: centerY - height / 2 };

  if (borderRadius === 0) {
    return (
      localPoint.x >= x &&
      localPoint.x <= x + width &&
      localPoint.y >= y &&
      localPoint.y <= y + height
    );
  }

  const radius = Math.min(borderRadius, width / 2, height / 2);

  const rectVertical = rectHitbox({
    ...rectangle,
    at: { x: x + radius, y },
    width: width - 2 * radius,
    borderRadius: 0,
    rotation: 0
  });

  const rectHorizontal = rectHitbox({
    ...rectangle,
    at: { x, y: y + radius },
    height: height - 2 * radius,
    borderRadius: 0,
    rotation: 0
  });

  if (rectVertical(localPoint) || rectHorizontal(localPoint)) return true;

  const isInTopLeftCircle = circleHitbox({
    at: { x: x + radius, y: y + radius },
    radius
  });

  const isInTopRightCircle = circleHitbox({
    at: { x: x + width - radius, y: y + radius },
    radius
  });

  const isInBottomLeftCircle = circleHitbox({
    at: { x: x + radius, y: y + height - radius },
    radius
  });

  const isInBottomRightCircle = circleHitbox({
    at: { x: x + width - radius, y: y + height - radius },
    radius
  });

  return (
    isInTopLeftCircle(localPoint) ||
    isInTopRightCircle(localPoint) ||
    isInBottomLeftCircle(localPoint) ||
    isInBottomRightCircle(localPoint)
  );
};


export const rectEfficientHitbox = (rectangle: Rect) => (boxToCheck: BoundingBox) => {
  const {
    at: rectAt,
    width: rectWidth,
    height: rectHeight,
  } = rectangle;

  const {
    at: boxAt,
    width: boxWidth,
    height: boxHeight,
  } = boxToCheck;

  const rectLeft = Math.min(rectAt.x, rectAt.x + rectWidth);
  const rectRight = Math.max(rectAt.x, rectAt.x + rectWidth);
  const rectTop = Math.min(rectAt.y, rectAt.y + rectHeight);
  const rectBottom = Math.max(rectAt.y, rectAt.y + rectHeight);

  const boxLeft = Math.min(boxAt.x, boxAt.x + boxWidth);
  const boxRight = Math.max(boxAt.x, boxAt.x + boxWidth);
  const boxTop = Math.min(boxAt.y, boxAt.y + boxHeight);
  const boxBottom = Math.max(boxAt.y, boxAt.y + boxHeight);

  if (rectRight <= boxLeft || boxRight <= rectLeft) {
    return false;
  }

  if (rectBottom <= boxTop || boxBottom <= rectTop) {
    return false;
  }

  return true;
};
