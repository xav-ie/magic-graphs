import { ref } from 'vue'
import { test, describe, expect } from 'vitest'
import { useHistory } from './index'

describe('useHistoryGraph', () => {

  const graph = useHistory(ref())

  test('undoes and redoes', () => {
    const node1 = graph.addNode({})
    const node2 = graph.addNode({})
    if (!node1 || !node2) throw new Error('Node is undefined')
    graph.addEdge({ from: node1.id, to: node2.id })
    const record = graph.undo()
    if (!record) throw new Error('Record is undefined')
    const { action, affectedItems } = record
    const { redoStack, undoStack } = graph
    expect(undoStack.value.length).toBe(2)
    expect(redoStack.value.length).toBe(1)
    expect(action).toBe('add')
    expect(affectedItems[0].graphType).toBe('edge')
    expect(redoStack.value).toContain(record)
  })

  test('clears history', () => {
    graph.addNode({})
    graph.addNode({})
    graph.undo()
    graph.redo()
    graph.clearHistory()
    expect(graph.undoStack.value.length).toBe(0)
    expect(graph.redoStack.value.length).toBe(0)
  })

  test('can redo and can undo are correct', () => {
    expect(graph.canUndo.value).toBe(false)
    expect(graph.canRedo.value).toBe(false)
    graph.addNode({})
    expect(graph.canUndo.value).toBe(true)
    graph.undo()
    expect(graph.canRedo.value).toBe(true)
    expect(graph.canUndo.value).toBe(false)
  })

  test('moves nodes correctly', () => {
    const node = graph.addNode({})
    if (!node) throw new Error('Node is undefined')

    // simulates a node being picked up and dropped in a new location
    graph.undoStack.value.push({
      action: 'move',
      affectedItems: [
        {
          graphType: 'node',
          data: {
            id: node.id,
            from: { x: 10, y: 10 },
            to: { x: 20, y: 20 }
          }
        }
      ]
    })

    graph.undo()

    expect(node.x).toBe(10)
    expect(node.y).toBe(10)

    graph.redo()

    expect(node.x).toBe(20)
    expect(node.y).toBe(20)
  })
})