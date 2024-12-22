import type { Coordinate, BoundingBox } from "@shape/types"
import type { Ellipse } from "@shape/ellipse"
import { STROKE_DEFAULTS } from "@shape/types"
import { rectEfficientHitbox } from "@shape/rect/hitbox";

export const ellipseHitbox = (ellipse: Ellipse) => (point: Coordinate) => {
  const dx = point.x - ellipse.at.x;
  const dy = point.y - ellipse.at.y;

  const stroke = {
    ...STROKE_DEFAULTS,
    ...ellipse.stroke
  };

  const radiusX = ellipse.radiusX + (stroke.width) / 2;
  const radiusY = ellipse.radiusY + (stroke.width) / 2;

  const inEllipse = (dx * dx) / (radiusX * radiusX) + (dy * dy) / (radiusY * radiusY) <= 1;

  return inEllipse;
}

export const getEllipseBoundingBox = (ellipse: Ellipse) => () => {
  const {
    at,
    radiusX,
    radiusY,
  } = ellipse

  const { width: borderWidth } = {
    ...STROKE_DEFAULTS,
    ...ellipse.stroke
  }

  return {
    topLeft: {
      x: at.x - (radiusX + (borderWidth / 2)),
      y: at.y - (radiusY + (borderWidth / 2))
    },
    bottomRight: {
      x: at.x + (radiusX + (borderWidth / 2)),
      y: at.y + (radiusY + (borderWidth / 2))
    }
  }
}

export const ellipseEfficientHitbox = (ellipse: Ellipse) => {
  const { topLeft, bottomRight } = getEllipseBoundingBox(ellipse)();

  const isInRectEfficientHitbox = rectEfficientHitbox({
    at: {
      x: topLeft.x,
      y: topLeft.y
    },
    width: bottomRight.x - topLeft.x,
    height: bottomRight.y - topLeft.y
  });

  return (boxToCheck: BoundingBox) => isInRectEfficientHitbox(boxToCheck)
}