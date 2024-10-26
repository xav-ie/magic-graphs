export const implementations = {
  ['BFS']: `const visited = new Set()
  const q = [1]
  while (q.length > 0) {
    const curr = q.shift()
    if (visited.has(curr)) continue
    visited.add(curr)
    const children = graph[curr]
    children.forEach(child => q.push(child))
  }`,
  ['DFS']: `const visited = new Set()
  const helper = (node) => {
    if (visited.has(node)) return
    visited.add(node)
    const children = graph[node]
    children.forEach(child => helper(child))
  }
  helper(1)`,
  ['Weighted BFS']: `const visited = new Set()
  const q = [1]
  while (q.length > 0) {
    const curr = q.shift()
    if (visited.has(curr)) continue
    visited.add(curr)
    const children = graph[curr]
    children.forEach(child => q.push(child.node))
  }`,
  ['Weighted DFS']: `const visited = new Set()
  const helper = (node) => {
    if (visited.has(node)) return
    visited.add(node)
    const children = graph[node]
    children.forEach(child => helper(child.node))
  }
  helper(1)`,
  ['Custom']: `graph['1']`
}