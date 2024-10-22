import type { AdjacencyList } from "@/graphConverters";

export const getStronglyConnectedComponents = (adjList: AdjacencyList): number[][] => {
  const numNodes = Object.keys(adjList).length;
  const ids: number[] = new Array(numNodes + 1).fill(-1);  // unique ids assigned to each node
  const low: number[] = new Array(numNodes + 1).fill(-1);  // lowest id reachable from the node
  const onStack: boolean[] = new Array(numNodes + 1).fill(false); // boolean array to check if node is in the stack
  const stack: number[] = [];
  let id = 0;
  const sccs: number[][] = [];

  const dfs = (at: number) => {
    stack.push(at);
    onStack[at] = true;
    ids[at] = low[at] = id++;

    for (const to of adjList[at]) {
      if (ids[to] === -1) {
        dfs(to);
        low[at] = Math.min(low[at], low[to]);
      } else if (onStack[to]) {
        low[at] = Math.min(low[at], ids[to]);
      }
    }

    // on recursive callback, if we're at the root (start of an SCC)
    if (ids[at] === low[at]) {
      const scc: number[] = [];
      while (stack.length > 0) {
        const node = stack.pop()!;
        onStack[node] = false;
        low[node] = ids[at];
        scc.push(node);
        if (node === at) break;
      }
      sccs.push(scc);
    }
  }

  // dfs every unvisited node
  for (const node in adjList) {
    if (ids[+node] === -1) {
      dfs(+node);
    }
  }

  return sccs;
}