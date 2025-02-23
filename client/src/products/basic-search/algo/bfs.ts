import type { GNode } from '@graph/types';
import type { AdjacencyList } from '@graph/useAdjacencyList';
import type { BasicSearchTrace } from './types';

export const bfs = (adjList: AdjacencyList, startNode: GNode['id']) => {
  const trace: BasicSearchTrace[] = [];

  const runBfs = () => {
    trace.push({
      visited: new Set(),
      nextToExplore: new Set(),
    });

    const visited = new Set<GNode['id']>();
    const queue = [startNode];
    while (queue.length > 0) {
      const currentNode = queue.shift()!;
      if (visited.has(currentNode)) continue;
      visited.add(currentNode);

      trace.push({
        currentNodeId: currentNode,
        visited: new Set(visited),
        nextToExplore: new Set(queue),
      });

      for (const neighbor of adjList[currentNode]) {
        queue.push(neighbor);
      }
    }

    trace.push({
      visited: new Set(visited),
      nextToExplore: new Set(),
    });
  };

  runBfs();

  return trace;
};
