import {
  ref,
  watch,
  onUnmounted,
  readonly,
} from 'vue';
import type { GNode, Graph } from '@graph/types';
import { nodesEdgesToAdjList } from '@graph/converters';

// node id -> bfs level
export type BFSLevelRecord = Record<GNode['label'], number>;

/**
 * reactive BFS level computation for a graph
 *
 * @param graph useGraph instance to compute BFS levels on
 * @param startNodeInput start node to compute BFS levels from
 * @returns bfsLevelRecord reactive record of node id -> bfs level and a reactive start node
 */
export const useBFSLevels = (graph: Graph, startNodeInput?: GNode['label']) => {

  const bfsLevelRecord = ref<BFSLevelRecord>({});
  const startNode = ref<GNode['label'] | undefined>(startNodeInput);

  const computeBfsLevels = () => {
    bfsLevelRecord.value = {};
    if (!startNode.value) return;
    const adjList = nodesEdgesToAdjList(graph.nodes.value, graph.edges.value)
    if (!adjList[startNode.value]) return;

    let queue = [startNode.value];
    const visited = new Set(queue);

    let currentLevel = 0;

    while (queue.length > 0) {
      const nextQueue = [];

      for (const node of queue) {
        bfsLevelRecord.value[node] = currentLevel;

        for (const neighbor of adjList[node]) {
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
  }

  graph.subscribe('onStructureChange', computeBfsLevels);
  onUnmounted(() => graph.unsubscribe('onStructureChange', computeBfsLevels));
  watch(startNode, computeBfsLevels);

  return {
    bfsLevelRecord: readonly(bfsLevelRecord),
    startNode,
  }
}