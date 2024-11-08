import { ref } from 'vue';
import { expect, test, describe } from 'vitest';
import { getAdjacencyList, getLabelAdjacencyList, useAdjacencyList } from './useAdjacencyList';
import { useBaseGraph } from './compositions/useBaseGraph';

describe('useAdjacencyList', () => {

  const graph = useBaseGraph(ref())

  const nodeA = graph.addNode({ id: 'a', label: '1', x: 0, y: 0 })
  const nodeB = graph.addNode({ id: 'b', label: '2', x: 0, y: 0 })
  const nodeC = graph.addNode({ id: 'c', label: '3', x: 0, y: 0 })

  graph.addEdge({ from: nodeA.id, to: nodeB.id })
  graph.addEdge({ from: nodeB.id, to: nodeC.id })
  graph.addEdge({ from: nodeC.id, to: nodeC.id })

  test('get adjacency list', () => {
    const adjacencyList = getAdjacencyList(graph)
    expect(adjacencyList).toEqual({
      [nodeA.id]: [nodeB.id],
      [nodeB.id]: [nodeC.id],
      [nodeC.id]: [nodeC.id]
    })
  })

  test('get label adjacency list', () => {
    const adjacencyList = getLabelAdjacencyList(graph)
    expect(adjacencyList).toEqual({
      [nodeA.label]: [nodeB.label],
      [nodeB.label]: [nodeC.label],
      [nodeC.label]: [nodeC.label]
    })
  })

  test('use adjacency list', () => {
    const { fullNodeAdjacencyList } = useAdjacencyList(graph)

    expect(fullNodeAdjacencyList.value).toEqual({
      [nodeA.id]: [nodeB],
      [nodeB.id]: [nodeC],
      [nodeC.id]: [nodeC]
    })

    graph.addEdge({ from: 'c', to: 'a', type: 'undirected' })

    expect(fullNodeAdjacencyList.value).toEqual({
      [nodeA.id]: [nodeB, nodeC],
      [nodeB.id]: [nodeC],
      [nodeC.id]: [nodeC, nodeA]
    })
  })
})