import type { Coordinate, Shape } from '@shape/types';
import { generateId } from '@utils/id';
import { getStarBoundingBox, starEfficientHitbox, starHitbox } from './hitbox';
import { drawStarWithCtx } from './draw';

export const STAR_DEFAULTS = {
  color: 'black',
  points: 5,
  rotation: 0,
} as const;

export type Star = {
  id?: string;
  at: Coordinate;
  color?: string;
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
  const drawShape = drawStarWithCtx(options);
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
