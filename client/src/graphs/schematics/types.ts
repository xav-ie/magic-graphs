import type { GraphAnimationController } from "@graph/animationController";
import type { GEdge, GNode } from "@graph/types";

/**
 * a shape resolver takes an id along with a controller and returns the shape
 * of the item (either a node or an edge)
 */
export type ShapeResolverOptions = {
  controller: GraphAnimationController,
  id: GEdge['id'] | GNode['id'],
}