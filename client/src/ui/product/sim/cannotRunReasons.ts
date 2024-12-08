
const minNodeText = (minNodes: number) => {
  if (minNodes === 1) return 'Requires at least 1 node'
  return `Requires at least ${minNodes} nodes`
}

const minEdgeText = (minEdges: number) => {
  if (minEdges === 1) return 'Requires at least 1 edge'
  return `Requires at least ${minEdges} edges`
}

export const CANT_RUN_REASONS = {
  NOT_WEIGHTED: 'Requires weighted edges',
  NOT_DIRECTED: 'Requires directed graph',
  NOT_ENOUGH_NODES: minNodeText,
  NOT_ENOUGH_EDGES: minEdgeText,
} as const