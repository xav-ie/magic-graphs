import { ref } from "vue";
import type { Ref } from "vue";
import { useBaseGraph } from "@graph/compositions/useBaseGraph";
import type { GraphOptions } from "@graph/types";
import type { GNodeMoveRecord, HistoryRecord } from "./types";

export const useHistoryGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<GraphOptions> = {},
) => {
  const graph = useBaseGraph(canvas, options);

  const undoStack = ref<HistoryRecord[]>([]);
  const redoStack = ref<HistoryRecord[]>([]);

  graph.subscribe('onNodeAdded', (node, { history }) => {
    if (!history) return;
    undoStack.value.push({
      action: 'add',
      affectedItems: [{
        graphType: 'node',
        data: node,
      }]
    })
  });

  graph.subscribe('onNodeRemoved', (node, { history }) => {
    if (!history) return;
    undoStack.value.push({
      action: 'remove',
      affectedItems: [{
        graphType: 'node',
        data: node,
      }]
    })
  });

  graph.subscribe('onEdgeAdded', (edge, { history }) => {
    if (!history) return;
    undoStack.value.push({
      action: 'add',
      affectedItems: [{
        graphType: 'edge',
        data: edge,
      }]
    })
  });

  graph.subscribe('onEdgeRemoved', (edge, { history }) => {
    if (!history) return;
    undoStack.value.push({
      action: 'remove',
      affectedItems: [{
        graphType: 'edge',
        data: edge,
      }]
    })
  });

  const movingNode = ref<GNodeMoveRecord>();

  graph.subscribe('onNodeDragStart', (node) => {
    movingNode.value = {
      graphType: 'node',
      id: node.id,
      from: { x: node.x, y: node.y },
      to: { x: node.x, y: node.y },
    }
  })

  graph.subscribe('onNodeDrop', (node) => {
    if (!movingNode.value) throw new Error('dropped a node we didn\'t know was being dragged');
    if (movingNode.value.id !== node.id) throw new Error('node ID mismatch');
    movingNode.value.to = { x: node.x, y: node.y };
    undoStack.value.push({
      action: 'move',
      affectedItems: [movingNode.value]
    })
  })

  const undo = () => {
    const record = undoStack.value.pop();
    if (!record) return;

    graph.emit('onUndo', record);
    redoStack.value.push(record);
    undoHistoryRecord(record);
  }

  const redo = () => {
    const record = redoStack.value.pop();
    if (!record) return;

    graph.emit('onRedo', record);
    undoStack.value.push(record);
    redoHistoryRecord(record);
  }

  const undoHistoryRecord = (record: HistoryRecord) => {
    if (record.action === 'add') {
      for (const item of record.affectedItems) {
        if (item.graphType === 'node') {
          graph.removeNode(item.data.id, { history: false });
        } else if (item.graphType === 'edge') {
          graph.removeEdge(item.data.id, { history: false });
        }
      }
    } else if (record.action === 'remove') {
      for (const item of record.affectedItems) {
        if (item.graphType === 'node') {
          graph.addNode(item.data, { history: false });
        } else if (item.graphType === 'edge') {
          graph.addEdge(item.data, { history: false });
        }
      }
    } else if (record.action === 'move') {
      for (const item of record.affectedItems) {
        if (item.graphType === 'node') {
          graph.moveNode(item.id, {
            x: item.from.x,
            y: item.from.y,
          });
        }
      }
    }
  }

  const redoHistoryRecord = (record: HistoryRecord) => {
    if (record.action === 'add') {
      for (const item of record.affectedItems) {
        if (item.graphType === 'node') {
          graph.addNode(item.data, { history: false });
        } else if (item.graphType === 'edge') {
          graph.addEdge(item.data, { history: false });
        }
      }
    } else if (record.action === 'remove') {
      for (const item of record.affectedItems) {
        if (item.graphType === 'node') {
          graph.removeNode(item.data.id, { history: false });
        } else if (item.graphType === 'edge') {
          graph.removeEdge(item.data.id, { history: false });
        }
      }
    } else if (record.action === 'move') {
      for (const item of record.affectedItems) {
        if (item.graphType === 'node') {
          graph.moveNode(item.id, {
            x: item.to.x,
            y: item.to.y,
          });
        }
      }
    }
  }

  const clearHistory = () => {
    undoStack.value = [];
    redoStack.value = [];
  }

  return {
    ...graph,

    /**
     * undoes the last action and moves it to the redo stack
     */
    undo,
    /**
     * redoes the last undone action and moves it to the undo stack
     */
    redo,

    /**
     * stores past actions to revert
     */
    undoStack,
    /**
     * stores undone actions to reapply
     */
    redoStack,

    /**
     * clears the undo and redo stacks
     */
    clearHistory,
  }
};