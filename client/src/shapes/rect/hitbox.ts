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
    stroke
  } = {
    ...RECT_DEFAULTS,
    ...rectangle
  };

  const centerX = at.x + width / 2;
  const centerY = at.y + height / 2;

  const strokeWidth = stroke?.width || 0

  const localPoint = rotatePoint(point, { x: centerX, y: centerY }, -rotation);

  const { x, y } = { x: centerX - width / 2, y: centerY - height / 2 };

  if (borderRadius === 0 || borderRadius === undefined) {
    return (
      localPoint.x >= x - strokeWidth / 2 &&
      localPoint.x <= x + width + strokeWidth / 2 &&
      localPoint.y >= y - strokeWidth / 2 &&
      localPoint.y <= y + height + strokeWidth / 2
    );
  }

  const radius = Math.min(borderRadius, width / 2, height / 2);

  const verticalWidth = Math.max(width - 2 * radius, 0);
  const horizontalHeight = Math.max(height - 2 * radius, 0);

  const rectVertical = rectHitbox({
    ...rectangle,
    at: { x: x + radius, y },
    width: verticalWidth,
    borderRadius: 0,
    rotation: 0,
    stroke,
  });

  const rectHorizontal = rectHitbox({
    ...rectangle,
    at: { x, y: y + radius },
    height: horizontalHeight,
    borderRadius: 0,
    rotation: 0,
    stroke,
  });

  if (rectVertical(localPoint) || rectHorizontal(localPoint)) return true;

  const isInTopLeftCircle = circleHitbox({
    at: { x: x + radius, y: y + radius },
    radius,
    stroke,
  });

  const isInTopRightCircle = circleHitbox({
    at: { x: x + width - radius, y: y + radius },
    radius,
    stroke,
  });

  const isInBottomLeftCircle = circleHitbox({
    at: { x: x + radius, y: y + height - radius },
    radius,
    stroke,
  });

  const isInBottomRightCircle = circleHitbox({
    at: { x: x + width - radius, y: y + height - radius },
    radius,
    stroke,
  });

  return (
    isInTopLeftCircle(localPoint) ||
    isInTopRightCircle(localPoint) ||
    isInBottomLeftCircle(localPoint) ||
    isInBottomRightCircle(localPoint)
  );
};

export const getRectBoundingBox = (rectangle: Rect) => () => {
  const {
    at: rectAt,
    width: rectWidth,
    height: rectHeight,
  } = rectangle;

  const rectLeft = Math.min(rectAt.x, rectAt.x + rectWidth);
  const rectRight = Math.max(rectAt.x, rectAt.x + rectWidth);
  const rectTop = Math.min(rectAt.y, rectAt.y + rectHeight);
  const rectBottom = Math.max(rectAt.y, rectAt.y + rectHeight);
  return {
    topLeft: { x: rectLeft, y: rectTop },
    bottomRight: { x: rectRight, y: rectBottom },
  }
}

export const rectEfficientHitbox = (rectangle: Rect) => (boxToCheck: BoundingBox) => {
  const {
    at: boxAt,
    width: boxWidth,
    height: boxHeight,
  } = boxToCheck;

  const { topLeft, bottomRight } = getRectBoundingBox(rectangle)();

  const boxLeft = Math.min(boxAt.x, boxAt.x + boxWidth);
  const boxRight = Math.max(boxAt.x, boxAt.x + boxWidth);
  const boxTop = Math.min(boxAt.y, boxAt.y + boxHeight);
  const boxBottom = Math.max(boxAt.y, boxAt.y + boxHeight);

  if (bottomRight.x <= boxLeft || boxRight <= topLeft.x) {
    return false;
  }

  if (bottomRight.y <= boxTop || boxBottom <= topLeft.y) {
    return false;
  }

  return true;
};
