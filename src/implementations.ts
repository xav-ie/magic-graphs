export const implementations = {
  bfs: `const visited = new Set()
const q = [1]
while (q.length > 0) {
  const curr = q.shift()
  if (visited.has(curr)) continue
  visited.add(curr)
  const children = graph[curr]
  children.forEach(child => q.push(child))
}`,
  dfs: `const visited = new Set()
const helper = (node) => {
  if (visited.has(node)) return
  visited.add(node)
  const children = graph[node]
  children.forEach(child => helper(child))
}
helper(1)
`,
}