import { ref } from 'vue';
import { expect, test, describe } from 'vitest';
import { useGraph } from '@graph/useGraph';
import {
  getAdjacencyList,
  getFullNodeAdjacencyList,
  getLabelAdjacencyList,
  useAdjacencyList
} from './useAdjacencyList';

describe('adjacency lists', () => {

  const graph = useGraph(ref())

  const nodeA = graph.addNode({ id: '1', label: 'a', x: 0, y: 0 })
  const nodeB = graph.addNode({ id: '2', label: 'b', x: 0, y: 0 })
  const nodeC = graph.addNode({ id: '3', label: 'c', x: 0, y: 0 })

  if (!nodeA || !nodeB || !nodeC) {
    throw new Error('Failed to create nodes')
  }

  const edge1 = graph.addEdge({ from: nodeA.id, to: nodeB.id })
  const edge2 = graph.addEdge({ from: nodeB.id, to: nodeC.id })
  const edge3 = graph.addEdge({ from: nodeC.id, to: nodeC.id })

  if (!edge1 || !edge2 || !edge3) {
    throw new Error('Failed to create edges')
  }

  test('get adjacency list', () => {
    graph.settings.value.isGraphDirected = true
    const adjacencyList = getAdjacencyList(graph)
    expect(adjacencyList).toEqual({
      [nodeA.id]: [nodeB.id],
      [nodeB.id]: [nodeC.id],
      [nodeC.id]: [nodeC.id]
    })
  })

  test('get adjacency list - undirected', () => {
    graph.settings.value.isGraphDirected = false
    const adjacencyList = getAdjacencyList(graph)
    expect(adjacencyList).toEqual({
      [nodeA.id]: [nodeB.id],
      [nodeB.id]: [nodeA.id, nodeC.id],
      [nodeC.id]: [nodeB.id, nodeC.id]
    })
  })

  test('get label adjacency list', () => {
    graph.settings.value.isGraphDirected = true
    const adjacencyList = getLabelAdjacencyList(graph)
    expect(adjacencyList).toEqual({
      [nodeA.label]: [nodeB.label],
      [nodeB.label]: [nodeC.label],
      [nodeC.label]: [nodeC.label]
    })
  })

  test('get full node adjacency list', () => {
    graph.settings.value.isGraphDirected = true
    const fullNodeAdjacencyList = getFullNodeAdjacencyList(graph)
    expect(fullNodeAdjacencyList).toEqual({
      [nodeA.id]: [nodeB],
      [nodeB.id]: [nodeC],
      [nodeC.id]: [nodeC]
    })
  })
})