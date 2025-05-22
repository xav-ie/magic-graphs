import { square } from "@shapes"
import type { Square } from "./square"
import type { Shape } from "./types"

type WithId<T> = Omit<T, 'id'> & {
  /**
   * a unique id required to track shapes across renders for caching
   */
  id: string
}

type ShapeWrapper<T> = (shapeSchema: WithId<T>) => Shape

/**
 * provides a wrapper around magic shapes that
 * increases shape rendering performance
 */
export const useOptimizedShapes = () => {

  const optimizedSquare: ShapeWrapper<Square> = (squareSchema) => {
    const sq = square(squareSchema)
    return {
      ...sq,
      drawShape: () => {
        console.log('draw intercepted')
      }
    }
  }

  return {
    optimizedSquare
  }
}