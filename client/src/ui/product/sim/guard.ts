import type { Graph } from "@graph/types"

const minNodeText = (minNodes: number) => {
  if (minNodes === 1) return 'Requires at least 1 node'
  return `Requires at least ${minNodes} nodes` as const
}

const minEdgeText = (minEdges: number) => {
  if (minEdges === 1) return 'Requires at least 1 edge'
  return `Requires at least ${minEdges} edges` as const
}

const invalidText = (thing?: string) => {
  if (!thing) return 'Invalid graph'
  return `Requires valid ${thing}` as const
}

/**
 * a map to from standard reasons why a simulation
 * cannot run on a given graph to user-facing text explaining why
 */
const CANT_RUN_REASONS = {
  INVALID: invalidText,
  NOT_WEIGHTED: 'Requires weighted edges',
  NOT_UNWEIGHTED: 'Requires unweighted edges',
  NOT_DIRECTED: 'Requires directed graph',
  NOT_UNDIRECTED: 'Requires undirected graph',
  NOT_ENOUGH_NODES: minNodeText,
  NOT_ENOUGH_EDGES: minEdgeText,
  NOT_CONNECTED: 'Requires connected graph',
  NOT_ACYCLIC: 'Requires acyclic graph',
  NOT_BIPARTITE: 'Requires bipartite graph',
  NEGATIVE_EDGE_WEIGHTS: 'Requires non-negative edge weights',
  NON_POSITIVE_EDGE_WEIGHTS: 'Requires positive edge weights',
  NOT_BIDIRECTIONAL: 'Requires no bidirectional edges',
} as const

/**
 * for determining if the simulation can run on the given graph.
 * returning a `string` indicates that the simulation cannot run and the string, user facing,
 * is the reason why it cannot. returning `undefined` indicates that the simulation can run
 */
type SimulationCanRunCheck = () => string | undefined

/**
 * a fluent builder for creating a guard that checks if a simulation can run on a given graph
 */
export class SimulationGuard {
  graph: Graph
  checks: SimulationCanRunCheck[] = []

  constructor(g: Graph) {
    this.graph = g
  }

  /**
   * checks if the graph is weighted
   */
  weighted() {
    const isWeighted = () => {
      if (!this.graph.settings.value.displayEdgeLabels) return CANT_RUN_REASONS.NOT_WEIGHTED
    }

    this.checks.push(isWeighted)

    return this
  }

  /**
   * checks if the graph is unweighted
   */
  unweighted() {
    const isUnweighted = () => {
      if (this.graph.settings.value.displayEdgeLabels) return CANT_RUN_REASONS.NOT_UNWEIGHTED
    }

    this.checks.push(isUnweighted)

    return this
  }

  /**
   * checks if the graph is directed
   */
  directed() {
    const isDirected = () => {
      if (!this.graph.settings.value.isGraphDirected) return CANT_RUN_REASONS.NOT_DIRECTED
    }

    this.checks.push(isDirected)

    return this
  }

  /**
   * checks if the graph is undirected
   */
  undirected() {
    const isUndirected = () => {
      if (this.graph.settings.value.isGraphDirected) return CANT_RUN_REASONS.NOT_UNDIRECTED
    }

    this.checks.push(isUndirected)
    return this
  }

  /**
   * checks if the graph has at least `minNodes` nodes
   * @param minNodes the minimum number of nodes
   */
  minNodes(minNodes: number) {
    const hasNodes = () => {
      if (this.graph.nodes.value.length < minNodes) return CANT_RUN_REASONS.NOT_ENOUGH_NODES(minNodes)
    }

    this.checks.push(hasNodes)
    return this
  }

  /**
   * checks if the graph has at least `minEdges` edges
   * @param minEdges the minimum number of edges
   */
  minEdges(minEdges: number) {
    const hasEdges = () => {
      if (this.graph.edges.value.length < minEdges) return CANT_RUN_REASONS.NOT_ENOUGH_EDGES(minEdges)
    }

    this.checks.push(hasEdges)
    return this
  }

  /**
   * checks if the graph is connected.
   */
  connected() {
    const isConnected = () => {
      if (!this.graph.characteristics.isConnected.value) return CANT_RUN_REASONS.NOT_CONNECTED
    }

    this.checks.push(isConnected)
    return this
  }

  /**
   * checks if the graph is acyclic
   */
  acyclic() {
    const isAcyclic = () => {
      if (!this.graph.characteristics.isAcyclic.value) return CANT_RUN_REASONS.NOT_ACYCLIC
    }

    this.checks.push(isAcyclic)
    return this
  }

  /**
   * checks if the graph is bipartite
   */
  bipartite() {
    const isBipartite = () => {
      if (!this.graph.characteristics.isBipartite.value) return CANT_RUN_REASONS.NOT_BIPARTITE
    }

    this.checks.push(isBipartite)
    return this
  }

  /**
   * checks if the graph has non-negative edge weights
   */
  nonNegativeEdgeWeights() {
    const nonNegativeWeights = () => {
      const isValid = this.graph.edges.value.every((e) => this.graph.helpers.getEdgeWeight(e.id) >= 0)
      if (!isValid) return CANT_RUN_REASONS.NEGATIVE_EDGE_WEIGHTS
    }

    this.checks.push(nonNegativeWeights)
    return this
  }

  /**
   * checks if the graph has positive edge weights
   */
  positiveEdgeWeights() {
    const positiveWeights = () => {
      const isValid = this.graph.edges.value.every((e) => this.graph.helpers.getEdgeWeight(e.id) > 0)
      if (!isValid) return CANT_RUN_REASONS.NON_POSITIVE_EDGE_WEIGHTS
    }

    this.checks.push(positiveWeights)
    return this
  }

  /**
   * checks if the graph has no bidirectional edges.
   * ie two nodes linked by two edges in opposite directions
   */
  noBidirectionalEdges() {
    const noBidirectional = () => {
      const isValid = this.graph.characteristics.hasBidirectionalEdges.value
      if (!isValid) return CANT_RUN_REASONS.NOT_BIDIRECTIONAL
    }

    this.checks.push(noBidirectional)
    return this
  }

  /**
   * wildcard check for any invalid graph
   * @param predicate a function that returns true if the graph is invalid
   * @param thing an optional string to describe what is invalid
   */
  invalid(predicate: () => boolean, thing?: string) {
    const isInvalid = () => {
      if (predicate()) return CANT_RUN_REASONS.INVALID(thing)
    }

    this.checks.push(isInvalid)
    return this
  }

  /**
   * builds the final check function
   */
  build() {
    return () => {
      for (const check of this.checks) {
        const reason = check()
        if (reason) return reason
      }
    }
  }
}