import type { Graph } from "@graph/types";

/**
 * prefix on the edge ids to indicate that they are residual edges
 */
export const RESIDUAL_ID = 'residual'

export const isResidual = (edgeId: string) => edgeId.startsWith(RESIDUAL_ID)
export const extractEdgeIdFromResidual = (residualId: string) => residualId.split('-')[1]
export const createResidualId = (edgeId: string) => `${RESIDUAL_ID}-${edgeId}`

export const useResidualEdges = (graph: Graph) => {

  const cleanupResidualEdges = () => {
    for (const edge of graph.edges.value) {
      if (!isResidual(edge.id)) continue
      const residualId = extractEdgeIdFromResidual(edge.id)
      const correspondingEdge = graph.getEdge(residualId)
      if (!correspondingEdge) throw 'big oopsie'
      const corrEdgeWeight = Number(correspondingEdge.label)
      const resEdgeWeight = Number(edge.label)
      correspondingEdge.label = (corrEdgeWeight + resEdgeWeight).toString()
    }

    graph.edges.value = graph.edges.value.filter((e) => !e.id.startsWith(RESIDUAL_ID))
    graph.trackGraphState()
  }

  const createResidualEdges = () => {
    const residualsAlreadyExist = graph.edges.value.some((e) => e.id.startsWith(RESIDUAL_ID))
    if (residualsAlreadyExist) return

    const residualEdges = graph.edges.value.map((e) => ({
      ...e,
      to: e.from,
      from: e.to,
      label: '0',
      id: createResidualId(e.id)
    }))

    graph.edges.value.push(...residualEdges)
  }

  return {
    cleanupResidualEdges,
    createResidualEdges,
    isResidual,
    getIdFromResidual: extractEdgeIdFromResidual,
    getResidualId: createResidualId,
  }
}