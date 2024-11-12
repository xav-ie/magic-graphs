import { ref } from "vue";
import type { Ref } from "vue";
import { useBaseGraph } from "@graph/compositions/useBaseGraph";
import type { GraphOptions } from "@graph/types";
import type { HistoryRecord } from "./types";

export const useHistoryGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<GraphOptions> = {},
) => {
  const graph = useBaseGraph(canvas, options);

  const stack = ref<HistoryRecord[]>([]);

  graph.subscribe('onNodeAdded', (node) => {
    stack.value.push({
      action: 'add',
      affectedItems: [{
        graphType: 'node',
        data: node,
      }]
    })
  });

  graph.subscribe('onNodeRemoved', (node) => {
    stack.value.push({
      action: 'remove',
      affectedItems: [{
        graphType: 'node',
        data: node,
      }]
    })
  });

  const undo = () => {
    const record = stack.value.pop();
    if (!record) return;

    if (record.action === 'add') {
      for (const item of record.affectedItems) {
        if (item.graphType === 'node') {
          graph.removeNode(item.data.id);
        } else if (item.graphType === 'edge') {
          graph.removeEdge(item.data.id);
        }
      }
    } else if (record.action === 'remove') {
      for (const item of record.affectedItems) {
        if (item.graphType === 'node') {
          graph.addNode(item.data);
        } else if (item.graphType === 'edge') {
          graph.addEdge(item.data);
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