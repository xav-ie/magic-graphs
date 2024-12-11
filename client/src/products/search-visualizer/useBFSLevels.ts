import {
  computed,
  type Ref,
} from 'vue';
import type { GNode, Graph } from '@graph/types';
import { useAdjacencyList } from '@graph/useAdjacencyList';

// node id -> bfs level
export type BFSLevelRecord = Record<GNode['id'], number>;

/**
 * reactive BFS level computation for a graph
 *
 * @param graph useGraph instance to compute BFS levels on
 * @param startNode start node to compute BFS levels from
 * @returns bfsLevelRecord reactive record of node id -> bfs level
 */
export const useBFSLevels = (graph: Graph, startNode: Ref<GNode>) => {
  const { adjacencyList } = useAdjacencyList(graph);

  return computed(() => {
    const bfsLevelRecord: BFSLevelRecord = {};
    if (!adjacencyList.value[startNode.value.id]) return;

    let queue = [startNode.value.id];
    const visited = new Set(queue);

    let currentLevel = 0;

    while (queue.length > 0) {
      const nextQueue = [];

      for (const nodeId of queue) {
        bfsLevelRecord[nodeId] = currentLevel;

        for (const neighbor of adjacencyList.value[nodeId]) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            nextQueue.push(neighbor);
          }
        }
      }

      queue = [];
      queue.push(...nextQueue);
      currentLevel++;
    }
  })
}