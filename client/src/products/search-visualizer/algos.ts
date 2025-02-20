export const BFS = `const visited = new Set()
  const q = [1]
  while (q.length > 0) {
    const curr = q.shift()
    if (visited.has(curr)) continue
    visited.add(curr)
    const children = graph[curr]
    children.forEach(child => q.push(child))
  }`;

export const DFS = `const visited = new Set()
  const helper = (node) => {
    if (visited.has(node)) return
    visited.add(node)
    const children = graph[node]
    children.forEach(child => helper(child))
  }
  helper(1)`;

export const WEIGHTED_BFS = `const visited = new Set()
  const q = [1]
  while (q.length > 0) {
    const curr = q.shift()
    if (visited.has(curr)) continue
    visited.add(curr)
    const children = graph[curr]
    children.forEach(child => q.push(child.node))
  }`;

export const WEIGHTED_DFS = `const visited = new Set()
  const helper = (node) => {
    if (visited.has(node)) return
    visited.add(node)
    const children = graph[node]
    children.forEach(child => helper(child.node))
  }
  helper(1)`;

export const algos = {
  ['BFS']: BFS,
  ['DFS']: DFS,
  ['Weighted BFS']: WEIGHTED_BFS,
  ['Weighted DFS']: WEIGHTED_DFS,
  ['Custom']: `graph['1']`,
} as const;

export type AlgoName = keyof typeof algos;
