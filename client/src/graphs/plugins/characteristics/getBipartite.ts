import type { AdjacencyList } from "@graph/useAdjacencyList";

export const getBipartitePartition = (graph: AdjacencyList): [string[], string[]] | undefined => {
  const colors: { [node: string]: 0 | 1 } = {};
  const groups: [string[], string[]] = [[], []];

  // Helper function to perform BFS coloring
  const bfs = (startNode: string): boolean => {
    const queue: string[] = [startNode];
    colors[startNode] = 0;
    groups[0].push(startNode);

    while (queue.length > 0) {
      const currentNode = queue.shift()!;
      const currentColor = colors[currentNode];
      const neighborColor = currentColor === 0 ? 1 : 0;

      for (const neighbor of graph[currentNode] || []) {
        // If neighbor hasn't been colored yet
        if (colors[neighbor] === undefined) {
          colors[neighbor] = neighborColor;
          groups[neighborColor].push(neighbor);
          queue.push(neighbor);
        }
        // If neighbor has been colored, check for conflict
        else if (colors[neighbor] === currentColor) {
          return false; // Not bi-partite
        }
      }
    }
    return true;
  };

  // Check each uncolored node
  for (const node of Object.keys(graph)) {
    if (colors[node] === undefined) {
      if (!bfs(node)) {
        return undefined; // Graph is not bi-partite
      }
    }
  }

  return groups;
}