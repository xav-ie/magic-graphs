import { ref } from "vue";
import type { Ref } from "vue";
import { useBaseGraph } from "@graph/compositions/useBaseGraph";
import type { GraphOptions } from "@graph/types";
import type { AddRemoveRecord, GNodeMoveRecord, HistoryRecord, MoveRecord } from "./types";
import { debounce } from "@utils/debounce";

/**
 * the max number of history records to keep in the undo and redo stacks
 */
const MAX_HISTORY = 100;

/**
 * the minimum distance a node must be moved to be considered a move action
 */
const MIN_DISTANCE = 3;


export const useHistoryGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<GraphOptions> = {},
) => {
  const graph = useBaseGraph(canvas, options);

  const undoStack = ref<HistoryRecord[]>([]);
  const redoStack = ref<HistoryRecord[]>([]);

  const gatheredRecords = {
    'add': [] as AddRemoveRecord['affectedItems'],
    'remove': [] as AddRemoveRecord['affectedItems'],
    'move': [] as MoveRecord['affectedItems'],
  };

  const writeToGatheredRecords = (record: HistoryRecord) => {
    if (record.action === 'add') {
      gatheredRecords['add'].push(...record.affectedItems);
    } else if (record.action === 'remove') {
      gatheredRecords['remove'].push(...record.affectedItems);
    } else if (record.action === 'move') {
      gatheredRecords['move'].push(...record.affectedItems);
    }
  }

  const writeToStack = (stack: HistoryRecord[]) => {
    const uniqueRecordTypes = Object
      .values(gatheredRecords)
      .filter((items) => items.length)

    if (uniqueRecordTypes.length === 0) return;
    if (uniqueRecordTypes.length > 1) throw new Error('history record mismatch');

    if (gatheredRecords['add'].length) {
      stack.push({
        action: 'add',
        affectedItems: [...gatheredRecords['add']],
      });
    }
    if (gatheredRecords['remove'].length) {
      stack.push({
        action: 'remove',
        affectedItems: [...gatheredRecords['remove']],
      });
    }
    if (gatheredRecords['move'].length) {
      stack.push({
        action: 'move',
        affectedItems: [...gatheredRecords['move']],
      });
    }

    for (const key of Object.keys(gatheredRecords) as (keyof typeof gatheredRecords)[]) {
      gatheredRecords[key] = [];
    }

    if (stack.length > MAX_HISTORY) {
      stack.shift();
    }
  }

  const writeToUndoStack = debounce(() => writeToStack(undoStack.value), 10);
  const writeToRedoStack = debounce(() => writeToStack(redoStack.value), 10);

  const addToUndoStack = (record: HistoryRecord) => {
    writeToGatheredRecords(record);
    writeToUndoStack();
  }

  const addToRedoStack = (record: HistoryRecord) => {
    writeToGatheredRecords(record);
    writeToRedoStack();
  }

  graph.subscribe('onNodeAdded', (node, { history }) => {
    if (!history) return;
    addToUndoStack({
      action: 'add',
      affectedItems: [{
        graphType: 'node',
        data: node,
      }]
    })
  });

  graph.subscribe('onNodeRemoved', (node, { history }) => {
    if (!history) return;
    addToUndoStack({
      action: 'remove',
      affectedItems: [{
        graphType: 'node',
        data: node,
      }]
    })
  });

  graph.subscribe('onEdgeAdded', (edge, { history }) => {
    if (!history) return;
    addToUndoStack({
      action: 'add',
      affectedItems: [{
        graphType: 'edge',
        data: edge,
      }]
    })
  });

  graph.subscribe('onEdgeRemoved', (edge, { history }) => {
    if (!history) return;
    addToUndoStack({
      action: 'remove',
      affectedItems: [{
        graphType: 'edge',
        data: edge,
      }]
    })
  });

  const movingNode = ref<GNodeMoveRecord['data']>();

  graph.subscribe('onNodeDragStart', (node) => {
    movingNode.value = {
      id: node.id,
      from: { x: node.x, y: node.y },
      to: { x: node.x, y: node.y },
    }
  })

  graph.subscribe('onNodeDrop', (node) => {
    if (!movingNode.value) throw new Error('dropped a node we didn\'t know was being dragged');
    if (movingNode.value.id !== node.id) throw new Error('node ID mismatch');
    movingNode.value.to = { x: node.x, y: node.y };

    const a = movingNode.value.from.y - movingNode.value.to.y
    const b = movingNode.value.from.x - movingNode.value.to.x
    const c = Math.sqrt(a ** 2 + b ** 2);

    if (c < MIN_DISTANCE) return;

    addToUndoStack({
      action: 'move',
      affectedItems: [{
        graphType: 'node',
        data: movingNode.value,
      }]
    })
  })

  const undo = () => {
    const record = undoStack.value.pop();
    if (!record) return;

    graph.emit('onUndo', record);
    addToRedoStack(record);
    undoHistoryRecord(record);
    return record;
  }

  const redo = () => {
    const record = redoStack.value.pop();
    if (!record) return;

    graph.emit('onRedo', record);
    addToUndoStack(record);
    redoHistoryRecord(record);
    return record;
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
          graph.addNode(item.data, { history: false, focus: false });
        } else if (item.graphType === 'edge') {
          graph.addEdge(item.data, { history: false, focus: false });
        }
      }
    } else if (record.action === 'move') {
      for (const item of record.affectedItems) {
        if (item.graphType === 'node') {
          const { from, id } = item.data;
          graph.moveNode(id, {
            x: from.x,
            y: from.y,
          });
        }
      }
    }
  }

  const redoHistoryRecord = (record: HistoryRecord) => {
    if (record.action === 'add') {
      for (const item of record.affectedItems) {
        if (item.graphType === 'node') {
          graph.addNode(item.data, { history: false, focus: false });
        } else if (item.graphType === 'edge') {
          graph.addEdge(item.data, { history: false, focus: false });
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
          const { to, id } = item.data;
          graph.moveNode(id, {
            x: to.x,
            y: to.y,
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
     * adds a record to the undo stack
     */
    addToUndoStack,
    /**
     * adds a record to the redo stack
     */
    addToRedoStack,

    /**
     * clears the undo and redo stacks
     */
    clearHistory,
  }
};