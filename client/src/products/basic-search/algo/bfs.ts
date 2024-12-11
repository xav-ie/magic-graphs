import type { GNode } from "@graph/types"
import type { AdjacencyList } from "@graph/useAdjacencyList"

export type BFSTrace = {
  currentNodeId?: GNode['id'],
  visited: Set<GNode['id']>,
  queue: Set<GNode['id']>
}[]

export const bfs = (adjList: AdjacencyList, startNode: GNode['id']) => {
  const trace: BFSTrace = []

  const runBfs = () => {
    trace.push({
      visited: new Set(),
      queue: new Set(),
    })

    const visited = new Set<GNode['id']>()
    const queue = [startNode]
    while (queue.length > 0) {
      const currentNode = queue.shift()!
      if (visited.has(currentNode)) continue
      visited.add(currentNode)

      trace.push({
        currentNodeId: currentNode,
        visited: new Set(visited),
        queue: new Set(queue),
      })

      for (const neighbor of adjList[currentNode]) {
        queue.push(neighbor)
      }
    }

    trace.push({
      visited: new Set(visited),
      queue: new Set(),
    })
  }

  runBfs()

  return trace
}