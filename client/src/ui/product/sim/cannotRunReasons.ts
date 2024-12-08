
const minNodeText = (minNodes: number) => {
  if (minNodes === 1) return 'Requires at least 1 node'
  return `Requires at least ${minNodes} nodes`
}

export const CANT_RUN_REASONS = {
  NOT_WEIGHTED: 'Requires weighted edges',
  NOT_DIRECTED: 'Requires directed graph',
  NOT_ENOUGH_NODES: minNodeText,
} as const