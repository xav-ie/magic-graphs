import type { Coordinate, Shape } from '@shape/types';
import { generateId } from '@utils/id';
import { starHitbox, starEfficientHitbox, getStarBoundingBox } from './hitbox';

export type Star = {
  id?: string;
  at: Coordinate;
  color: string;
  innerRadius: number;
  outerRadius: number;
  rotation?: number;
  points?: number;
};

/**
 * Creates a star shape
 * @throws {Error} If points < 3, innerRadius >= outerRadius, or negative radius values
 */
export const star = (options: Star): Shape => {
  const {
    at,
    color,
    innerRadius,
    outerRadius,
    rotation = 0,
    points = 5,
  } = options;

  if (points < 3) {
    throw new Error('star must have at least 3 points');
  }
  if (innerRadius >= outerRadius) {
    throw new Error('inner radius must be less than outer radius');
  }
  if (innerRadius < 0 || outerRadius < 0) {
    throw new Error('radius values must be positive');
  }

  const drawShape = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.beginPath();
    ctx.translate(at.x, at.y);
    ctx.rotate(rotation);

    // Draw the star shape
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  };

  const shapeHitbox = starHitbox(options);
  const hitbox = shapeHitbox;
  const efficientHitbox = starEfficientHitbox(options);
  const getBoundingBox = getStarBoundingBox(options);

  return {
    id: options.id ?? generateId(),
    name: 'star',
    draw: drawShape,
    drawShape,
    hitbox,
    shapeHitbox,
    efficientHitbox,
    getBoundingBox,
  };
};
