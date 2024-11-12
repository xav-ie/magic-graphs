import { ref } from 'vue'
import { test, describe, expect } from 'vitest'
import { useHistoryGraph } from './index'

describe('useHistoryGraph', () => {

  const graph = useHistoryGraph(ref())

  test('undoes and redoes', () => {
    graph.addNode({})
    graph.addNode({})
    const record = graph.undo()
    expect(graph.undoStack.value.length).toBe(1)
    expect(graph.redoStack.value.length).toBe(1)
    expect(record?.action).toBe('add')
    expect(record?.affectedItems[0].graphType).toBe('node')
    expect(graph.redoStack.value).toContain(record)
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

  test('moves items correctly', () => {
    const node = graph.addNode({})

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