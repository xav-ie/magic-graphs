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

const djb2Hasher = (str: string) => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  return hash >>> 0;
}

type DJB2Hash = ReturnType<typeof djb2Hasher>

/**
 * provides a wrapper around magic shapes that
 * increases shape rendering performance
 */
export const useOptimizedShapes = () => {

  /**
   * maps a shapes provided schema `id` to a serialized version of
   * the schema in order to perform diffing
   */
  const cache: Map<string, DJB2Hash> = new Map()

  const serializeSchema = (schema: unknown) => {
    return djb2Hasher(JSON.stringify(schema))
  }

  const hasSchemaChanged = (schemaId: string, serializedSchema: DJB2Hash) => {
    const cachedSchema = cache.get(schemaId)
    if (!cachedSchema) return true
    return cachedSchema !== serializedSchema
  }

  const optimizedSquare: ShapeWrapper<Square> = (squareSchema) => {
    const sq = square(squareSchema)

    return {
      ...sq,
      draw: (ctx) => {
        console.log('draw intercepted with id', squareSchema.id)
        const serializedSchema = serializeSchema(squareSchema)
        const hasChanged = hasSchemaChanged(squareSchema.id, serializedSchema)
        if (hasChanged) {
          console.log('schema has changed since last render')
        } else {
          console.log('schema same since last render. no need to draw it out again!')
        }
        cache.set(squareSchema.id, serializedSchema)
        sq.draw(ctx)
      },
      drawShape: (ctx) => {
        console.log('drawShape intercepted with id', squareSchema.id)
        sq.drawShape(ctx)
      },
    }
  }

  return {
    optimizedSquare
  }
}