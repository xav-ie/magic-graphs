import { computed } from 'vue';
import type { Ref } from 'vue';
import type { GNode, Graph } from '@graph/types';
import { useAdjacencyList } from '@graph/useAdjacencyList';

// node id -> depth in a BFS tree
export type NodeIdToDepth = Map<GNode['id'], number>;

/**
 * reactive {@link NodeIdToDepth | node depth} computation using BFS
 *
 * @param graph useGraph instance
 * @param startNode the root node of the tree
 * @returns reactive map of node id to depth and the depth of the tree
 */
export const useNodeDepth = (graph: Graph, startNode: Ref<GNode>) => {
  const { adjacencyList } = useAdjacencyList(graph);

  return computed(() => {
    const nodeIdToDepth: NodeIdToDepth = new Map();
    if (!adjacencyList.value[startNode.value.id]) return;

    let queue = [startNode.value.id];
    const visited = new Set(queue);

    let currentDepth = 0;

    while (queue.length > 0) {
      const nextQueue = [];

      for (const nodeId of queue) {
        nodeIdToDepth.set(nodeId, currentDepth);

        for (const neighbor of adjacencyList.value[nodeId]) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            nextQueue.push(neighbor);
          }
        }
      }

      queue = [];
      queue.push(...nextQueue);
      currentDepth++;
    }

    return {
      nodeIdToDepth,
      depthToNodeIds: Array
        .from(nodeIdToDepth)
        .reduce<GNode['id'][][]>((acc, [nodeId, depth]) => {
          if (!acc[depth]) {
            acc[depth] = [];
          }
          acc[depth].push(nodeId);
          return acc;
        }, []),
      depth: currentDepth - 1,
    };
  })
}