import type { GEdge, GNode } from "./types"

type ItemId = GNode['id'] | GEdge['id']

/**
 * maps the id of a node or edge to the progress of its current animation
 */
export type IdToProgress = Map<ItemId, number>

export const DURATION_MS = 500

/**
 * keeps track of animation state for node and edges animating
 * in and out of existence
 */
export const useAnimationController = () => {
  const itemsAnimatingOut: IdToProgress = new Map()
  const itemsAnimatingIn: IdToProgress = new Map()

  const runAnimation = async (id: ItemId, map: IdToProgress) => {
    map.set(id, 0)

    for (let i = 0; i <= DURATION_MS; i++) {
      setTimeout(() => {
        map.set(id, i)
      }, 1 * i)
    }

    await new Promise(res => setTimeout(res, DURATION_MS))
    map.delete(id)
  }

  const animateIn = (id: ItemId) => runAnimation(id, itemsAnimatingIn)
  const animateOut = (id: ItemId) => runAnimation(id, itemsAnimatingOut)

  return {
    animateIn,
    animateOut,

    itemsAnimatingIn,
    itemsAnimatingOut,
  }
}

export type GraphAnimationController = ReturnType<typeof useAnimationController>