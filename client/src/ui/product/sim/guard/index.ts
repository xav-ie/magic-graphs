import type { DeepReadonly } from "ts-essentials"
import type { Graph } from "@graph/types"
import { useNodeEdgeColorizer } from "./theme/useNodeEdgeColorizer"
import { CANT_RUN_REASONS } from "./constants"
import type { Reason } from "./types"

/**
 * determines if the simulation can run.
 * returning a {@link Reason} fails the check for `Reason`, otherwise it passes.
 * simulations must pass all checks to clear {@link SimulationGuard.check}
 */
export type SimulationGuardCheck = () => DeepReadonly<Reason> | undefined

/**
 * a builder to create a guard for simulations to ensure the graph is compatible
 * with the simulation before running it
 */
export class SimulationGuard {
  graph: Graph
  checks: SimulationGuardCheck[] = []

  constructor(g: Graph) {
    this.graph = g
  }

  /**
   * ensures the graph is weighted
   */
  weighted() {
    const isWeighted = () => {
      if (this.graph.settings.value.displayEdgeLabels) return
      return {
        ...CANT_RUN_REASONS.NOT_WEIGHTED
      }
    }

    this.checks.push(isWeighted)
    return this
  }

  /**
   * ensures the graph is unweighted
   */
  unweighted() {
    const allEdgeIds = this.graph.edges.value.map((e) => e.id)
    const color = useNodeEdgeColorizer(this.graph, new Set(allEdgeIds))

    const isUnweighted = () => {
      if (!this.graph.settings.value.displayEdgeLabels) return
      return {
        themer: {
          theme: color.colorize,
          untheme: color.decolorize,
        },
        ...CANT_RUN_REASONS.NOT_UNWEIGHTED,
      }
    }

    this.checks.push(isUnweighted)
    return this
  }

  /**
   * ensures the graph is directed
   */
  directed() {
    const isDirected = () => {
      if (this.graph.settings.value.isGraphDirected) return
      return {
        ...CANT_RUN_REASONS.NOT_DIRECTED,
      }
    }

    this.checks.push(isDirected)
    return this
  }

  /**
   * ensures the graph is undirected
   */
  undirected() {
    const isUndirected = () => {
      if (!this.graph.settings.value.isGraphDirected) return
      return {
        ...CANT_RUN_REASONS.NOT_UNDIRECTED,
      }
    }

    this.checks.push(isUndirected)
    return this
  }

  /**
   * ensures the graph has at least `minNodes` nodes
   * @param minNodes the minimum number of nodes
   */
  minNodes(minNodes: number) {
    const hasNodes = () => {
      if (this.graph.nodes.value.length >= minNodes) return
      return {
        ...CANT_RUN_REASONS.NOT_ENOUGH_NODES(minNodes),
      }
    }

    this.checks.push(hasNodes)
    return this
  }

  /**
   * ensures the graph has at least `minEdges` edges
   * @param minEdges the minimum number of edges
   */
  minEdges(minEdges: number) {
    const hasEdges = () => {
      if (this.graph.edges.value.length >= minEdges) return
      return {
        ...CANT_RUN_REASONS.NOT_ENOUGH_EDGES(minEdges),
      }
    }

    this.checks.push(hasEdges)
    return this
  }

  /**
   * ensures the graph is connected
   */
  connected() {
    const isConnected = () => {
      if (this.graph.characteristics.isConnected.value) return
      return {
        ...CANT_RUN_REASONS.NOT_CONNECTED,
      }
    }

    this.checks.push(isConnected)
    return this
  }

  /**
   * ensures the graph is acyclic
   */
  acyclic() {
    const isAcyclic = () => {
      if (this.graph.characteristics.isAcyclic.value) return
      return {
        ...CANT_RUN_REASONS.NOT_ACYCLIC,
      }
    }

    this.checks.push(isAcyclic)
    return this
  }

  /**
   * ensures the graph is bipartite
   */
  bipartite() {
    const isBipartite = () => {
      if (this.graph.characteristics.isBipartite.value) return
      return {
        ...CANT_RUN_REASONS.NOT_BIPARTITE,
      }
    }

    this.checks.push(isBipartite)
    return this
  }

  /**
   * ensures the graph has non-negative edge weights
   */
  nonNegativeEdgeWeights() {
    const nonNegativeWeights = () => {
      const isValid = this.graph.edges.value.every((e) => this.graph.helpers.getEdgeWeight(e.id) >= 0)
      if (isValid) return
      return {
        ...CANT_RUN_REASONS.NEGATIVE_EDGE_WEIGHTS,
      }
    }

    this.checks.push(nonNegativeWeights)
    return this
  }

  /**
   * ensures the graph has positive edge weights
   */
  positiveEdgeWeights() {
    const positiveWeights = () => {
      const isValid = this.graph.edges.value.every((e) => this.graph.helpers.getEdgeWeight(e.id) > 0)
      if (isValid) return
      return {
        ...CANT_RUN_REASONS.NON_POSITIVE_EDGE_WEIGHTS,
      }
    }

    this.checks.push(positiveWeights)
    return this
  }

  /**
   * ensures the graph has no bidirectional edges
   * ie two nodes linked by two edges in opposite directions
   */
  noBidirectionalEdges() {
    const noBidirectional = () => {
      const isValid = this.graph.characteristics.hasBidirectionalEdges.value
      if (isValid) return
      return {
        ...CANT_RUN_REASONS.NOT_BIDIRECTIONAL,
      }
    }

    this.checks.push(noBidirectional)
    return this
  }

  /**
   * a wildcard check for anything that may make the graph not compatible with the simulation
   *
   * @param predicate a function that returns `false` if the simulation cannot run
   * @param invalidationReason the reason why the graph cannot run the simulation
   */
  valid(predicate: () => boolean, invalidationReason: Reason) {
    const isInvalid = () => {
      if (!predicate()) return invalidationReason
    }

    this.checks.push(isInvalid)
    return this
  }

  /**
   * @returns the final check function that run all the checks
   */
  build() {
    return () => {
      for (const check of this.checks) {
        const reason = check()
        if (reason) return reason
      }
    }
  }

  /**
   * checks if the simulation can run on the graph.
   * @returns a {@link Reason} if it cant or `undefined` if it can
   */
  check() {
    return this.build()()
  }
}