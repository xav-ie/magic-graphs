import { computed, ref } from 'vue';
import type { BaseGraph } from '@graph/base';
import type { GNode, GEdge } from '@graph/types';
import {
  DEFAULT_REDO_HISTORY_OPTIONS,
  DEFAULT_UNDO_HISTORY_OPTIONS,
} from './types';
import type {
  HistoryRecord,
  RedoHistoryOptions,
  UndoHistoryOptions,
  GNodeMoveRecord,
  GNodeRecord,
  GEdgeRecord,
} from './types';
import type { Coordinate } from '@shape/types';

/**
 * the max number of history records to keep in the undo and redo stacks
 */
const MAX_HISTORY = 100;

/**
 * the minimum distance a node must be moved to be considered a move action
 * that should be added to the history stack
 */
const MIN_DISTANCE = 3;

export const useHistory = (graph: BaseGraph) => {
  const undoStack = ref<HistoryRecord[]>([]);
  const redoStack = ref<HistoryRecord[]>([]);

  const addToUndoStack = (record: HistoryRecord) => {
    undoStack.value.push(record);
    if (undoStack.value.length > MAX_HISTORY) {
      undoStack.value.shift();
    }
  };

  const addToRedoStack = (record: HistoryRecord) => {
    redoStack.value.push(record);
    if (redoStack.value.length > MAX_HISTORY) {
      redoStack.value.shift();
    }
  };

  const pendingNodeRemovals = ref<GNode[]>([]);
  const pendingEdgeRemovals = ref<GEdge[]>([]);
  const removalTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

  const processRemovals = () => {
    if (
      pendingNodeRemovals.value.length === 0 &&
      pendingEdgeRemovals.value.length === 0
    )
      return;

    addToUndoStack({
      action: 'remove',
      affectedItems: [
        ...pendingNodeRemovals.value.map(
          (node) =>
            ({
              graphType: 'node',
              data: node,
            }) as GNodeRecord,
        ),
        ...pendingEdgeRemovals.value.map(
          (edge) =>
            ({
              graphType: 'edge',
              data: edge,
            }) as GEdgeRecord,
        ),
      ],
    });

    pendingNodeRemovals.value = [];
    pendingEdgeRemovals.value = [];
    removalTimeout.value = null;
  };

  graph.subscribe('onNodeAdded', (node, { history }) => {
    if (!history) return;
    addToUndoStack({
      action: 'add',
      affectedItems: [
        {
          graphType: 'node',
          data: node,
        },
      ],
    });
  });

  graph.subscribe('onBulkNodeAdded', (nodes, { history }) => {
    if (!history) return;
    addToUndoStack({
      action: 'add',
      affectedItems: nodes.map((node) => ({
        graphType: 'node',
        data: node,
      })),
    });
  });

  graph.subscribe('onNodeRemoved', (removedNode, removedEdges, { history }) => {
    if (!history) return;

    const edgeRecords = removedEdges.map(
      (edge) =>
        ({
          graphType: 'edge',
          data: edge,
        }) as const,
    );

    addToUndoStack({
      action: 'remove',
      affectedItems: [
        {
          graphType: 'node',
          data: removedNode,
        },
        ...edgeRecords,
      ],
    });
  });

  graph.subscribe(
    'onBulkNodeRemoved',
    (removedNodes, removedEdges, { history }) => {
      if (!history) return;

      pendingNodeRemovals.value.push(...removedNodes);
      pendingEdgeRemovals.value.push(...removedEdges); // These edges are already part of node deletion

      if (!removalTimeout.value) {
        removalTimeout.value = setTimeout(processRemovals, 0);
      }
    },
  );

  graph.subscribe('onEdgeLabelEdited', (edge, oldLabel, { history }) => {
    if (!history) return;
    addToUndoStack({
      action: 'edit',
      affectedItems: [
        {
          graphType: 'edge',
          data: {
            id: edge.id,
            from: oldLabel,
            to: edge.label,
          },
        },
      ],
    });
  });

  graph.subscribe('onEdgeAdded', (edge, { history }) => {
    if (!history) return;
    addToUndoStack({
      action: 'add',
      affectedItems: [
        {
          graphType: 'edge',
          data: edge,
        },
      ],
    });
  });

  graph.subscribe('onBulkEdgeAdded', (edges, { history }) => {
    if (!history) return;
    addToUndoStack({
      action: 'add',
      affectedItems: edges.map((edge) => ({
        graphType: 'edge',
        data: edge,
      })),
    });
  });

  graph.subscribe('onEdgeRemoved', (edge, { history }) => {
    if (!history) return;
    addToUndoStack({
      action: 'remove',
      affectedItems: [
        {
          graphType: 'edge',
          data: edge,
        },
      ],
    });
  });

  graph.subscribe('onBulkEdgeRemoved', (edges, { history }) => {
    if (!history) return;
    pendingEdgeRemovals.value.push(...edges);

    if (!removalTimeout.value) {
      removalTimeout.value = setTimeout(processRemovals, 0);
    }
  });

  const groupDrag = ref<{
    startingCoordinates: Coordinate;
    nodes: Readonly<GNode[]>;
  }>();

  graph.subscribe('onGroupDragStart', (nodes, startingCoordinates) => {
    groupDrag.value = {
      startingCoordinates,
      nodes,
    };
  });

  graph.subscribe('onGroupDrop', (nodes, endingCoordinates) => {
    if (!groupDrag.value)
      throw new Error("dropped a group we didn't know was being dragged");
    if (groupDrag.value.nodes.length !== nodes.length)
      throw new Error('group size mismatch');

    const dy = groupDrag.value.startingCoordinates.y - endingCoordinates.y;
    const dx = groupDrag.value.startingCoordinates.x - endingCoordinates.x;
    const c = Math.sqrt(dy ** 2 + dx ** 2);

    if (c < MIN_DISTANCE) return;

    addToUndoStack({
      action: 'move',
      affectedItems: groupDrag.value.nodes.map((node) => ({
        graphType: 'node',
        data: {
          id: node.id,
          from: { x: node.x + dx, y: node.y + dy },
          to: { x: node.x, y: node.y },
        },
      })),
    });
  });

  const movingNode = ref<GNodeMoveRecord['data']>();

  graph.subscribe('onNodeDragStart', (node) => {
    movingNode.value = {
      id: node.id,
      from: { x: node.x, y: node.y },
      to: { x: node.x, y: node.y },
    };
  });

  graph.subscribe('onNodeDrop', (node) => {
    if (!movingNode.value)
      throw new Error("dropped a node we didn't know was being dragged");
    if (movingNode.value.id !== node.id) throw new Error('node ID mismatch');
    movingNode.value.to = { x: node.x, y: node.y };

    const dy = movingNode.value.from.y - movingNode.value.to.y;
    const dx = movingNode.value.from.x - movingNode.value.to.x;
    const c = Math.sqrt(dy ** 2 + dx ** 2);

    if (c < MIN_DISTANCE) return;

    addToUndoStack({
      action: 'move',
      affectedItems: [
        {
          graphType: 'node',
          data: movingNode.value,
        },
      ],
    });
  });

  const undo = (options: Partial<UndoHistoryOptions> = {}) => {
    const record = undoStack.value.pop();
    if (!record) return;

    addToRedoStack(record);
    undoHistoryRecord(record);
    graph.emit('onUndo', record, {
      ...DEFAULT_UNDO_HISTORY_OPTIONS,
      ...options,
    });

    return record;
  };

  const redo = (options: Partial<RedoHistoryOptions> = {}) => {
    const record = redoStack.value.pop();
    if (!record) return;

    addToUndoStack(record);
    redoHistoryRecord(record);
    graph.emit('onRedo', record, {
      ...DEFAULT_REDO_HISTORY_OPTIONS,
      ...options,
    });

    return record;
  };

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
    } else if (record.action === 'edit') {
      for (const item of record.affectedItems) {
        graph.editEdgeLabel(item.data.id, item.data.from, { history: false });
      }
    }
  };

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
    } else if (record.action === 'edit') {
      for (const item of record.affectedItems) {
        graph.editEdgeLabel(item.data.id, item.data.to, { history: false });
      }
    }
  };

  const clearHistory = () => {
    undoStack.value = [];
    redoStack.value = [];
  };

  return {
    /**
     * undoes the last action and moves it to the redo stack
     */
    undo,
    /**
     * redoes the last undone action and moves it to the undo stack
     */
    redo,
    /**
     * true if there are actions to undo
     */
    canUndo: computed(() => undoStack.value.length > 0),
    /**
     * true if there are actions to redo
     */
    canRedo: computed(() => redoStack.value.length > 0),

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
  };
};

export type GraphHistoryControls = ReturnType<typeof useHistory>;
export type GraphHistoryPlugin = {
  /**
   * controls for undoing and redoing actions in the graph
   * such as adding, removing, moving, and editing nodes and edges
   */
  history: GraphHistoryControls;
};
