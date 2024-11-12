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

  const stack = ref<HistoryRecord[]>([]);

  graph.subscribe('onNodeAdded', (node, { history }) => {
    if (!history) return;
    stack.value.push({
      action: 'add',
      affectedItems: [{
        graphType: 'node',
        data: node,
      }]
    })
  });

  graph.subscribe('onNodeRemoved', (node, { history }) => {
    if (!history) return;
    stack.value.push({
      action: 'remove',
      affectedItems: [{
        graphType: 'node',
        data: node,
      }]
    })
  });

  graph.subscribe('onEdgeAdded', (edge, { history }) => {
    if (!history) return;
    stack.value.push({
      action: 'add',
      affectedItems: [{
        graphType: 'edge',
        data: edge,
      }]
    })
  });

  graph.subscribe('onEdgeRemoved', (edge, { history }) => {
    if (!history) return;
    stack.value.push({
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
      x: node.x,
      y: node.y,
    }
  })

  graph.subscribe('onNodeDrop', (node) => {
    if (!movingNode.value) throw new Error('dropped a node we didn\'t know was being dragged');
    if (movingNode.value.id !== node.id) throw new Error('node ID mismatch');
    stack.value.push({
      action: 'move',
      affectedItems: [movingNode.value]
    })
  })

  const undo = () => {
    const record = stack.value.pop();
    if (!record) return;

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
            x: item.x,
            y: item.y,
          });
        }
      }
    }
  }

  const redo = () => {}

  return {
    ...graph,

    /**
     * Undo the last action
     */
    undo,
    /**
     * Redo the last action
     */
    redo,
    /**
     * where the history is stored. like a history book, but in reverse order.
     * just like in real life, we recommend not re-writing history.
     */
    historyStack: stack,
  }
};