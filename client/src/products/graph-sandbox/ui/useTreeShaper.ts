import type { Graph } from "@graph/types";

export const useTreeShaper = (graph: Graph) => {
  const shapeGraph = () => {

    console.log('Shaping graph...')
  }

  return {
    shapeGraph
  }
}