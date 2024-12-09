import type { AdjacencyList } from "@graph/useAdjacencyList";

export const getBipartitePartition = (adjList: AdjacencyList): [string[], string[]] | undefined => {
  const colors: { [node: string]: 0 | 1 } = {};
  const groups: [string[], string[]] = [[], []];

  // Build a complete graph representation including all nodes
  const completeGraph: AdjacencyList = { ...adjList };

  // Ensure all nodes are in the graph
  Object.keys(adjList).forEach(node => {
    if (!completeGraph[node]) {
      completeGraph[node] = [];
    }
  });

  // Build a reverse adjacency list to check incoming edges
  const reverseGraph: AdjacencyList = {};
  Object.entries(completeGraph).forEach(([node, neighbors]) => {
    neighbors.forEach(neighbor => {
      if (!reverseGraph[neighbor]) {
        reverseGraph[neighbor] = [];
      }
      reverseGraph[neighbor].push(node);
    });
  });

  // Helper function to perform BFS coloring
  const bfs = (startNode: string): boolean => {
    const queue: string[] = [startNode];
    colors[startNode] = 0;
    groups[0].push(startNode);

    while (queue.length > 0) {
      const currentNode = queue.shift()!;
      const currentColor = colors[currentNode];
      const neighborColor = currentColor === 0 ? 1 : 0;

      // Check both outgoing and incoming edges
      const outgoingNeighbors = completeGraph[currentNode] || [];
      const incomingNeighbors = reverseGraph[currentNode] || [];
      const allNeighbors = [...new Set([...outgoingNeighbors, ...incomingNeighbors])];

      for (const neighbor of allNeighbors) {
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

  // Try to color all nodes
  for (const node of Object.keys(completeGraph)) {
    if (colors[node] === undefined) {
      if (!bfs(node)) {
        return undefined; // Not bi-partite
      }
    }
  }

  return groups;
}