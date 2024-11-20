import { ref } from "vue";
import type { Ref } from "vue";
import type { GNode, Graph } from "@graph/types";
import { LETTERS, graphLabelGetter } from "@graph/labels";
import { selectFromGraph, selectNode } from "@graph/select";
import type { SelectControls } from "@graph/select";
import { SINK_LABEL, SOURCE_LABEL } from "./constants";

const ALPHABET_WITHOUT_SOURCE_SINK = LETTERS.filter(l => l !== SOURCE_LABEL && l !== SINK_LABEL);

/**
 * labeller network flow graph instances (nodes)
 */
export const flowNodeLabelGetter = (graph: Pick<Graph, 'nodes'>) => {
  return graphLabelGetter(graph.nodes, ALPHABET_WITHOUT_SOURCE_SINK);
}

/**
 * controls for setting source and sink nodes in a network flow graph
 *
 * @param graph the graph instance to control
 * @returns controls for setting source and sink nodes
 */
export const useSourceSinkControls = (graph: Graph) => {
  const initialSource = graph.nodes.value.find(node => node.label === SOURCE_LABEL);
  const initialSink = graph.nodes.value.find(node => node.label === SINK_LABEL);

  const sourceNode = ref<GNode | undefined>(initialSource);
  const sinkNode = ref<GNode | undefined>(initialSink);

  const cancelSetSourceNode = ref<SelectControls['cancelSelection']>();
  const cancelSetSinkNode = ref<SelectControls['cancelSelection']>();

  const nodeSelector = async (
    nodeRef: Ref<GNode | undefined>,
    cancelRef: Ref<SelectControls['cancelSelection'] | undefined>,
  ) => {
    const { selectedItemPromise, cancelSelection } = selectFromGraph(graph, (item) => {
      const isAlreadySourceOrSink = item.id === sourceNode.value?.id || item.id === sinkNode.value?.id;
      return item.graphType === 'node' && !isAlreadySourceOrSink;
    });
    cancelRef.value = cancelSelection;

    const nodeSchema = await selectedItemPromise;
    if (!nodeSchema) return cancelRef.value = undefined; // cancelled

    const node = graph.getNode(nodeSchema.id);
    if (!node) throw new Error('illegitimate schema item returned from selectNode');

    nodeRef.value = node;

    cancelRef.value = undefined;
    graph.trackGraphState();
  }

  return {
    source: sourceNode,
    sink: sinkNode,

    setSourceNode: () => nodeSelector(sourceNode, cancelSetSourceNode),
    setSinkNode: () => nodeSelector(sinkNode, cancelSetSinkNode),

    cancelSetSourceNode,
    cancelSetSinkNode,
  }
};

export type SourceSinkControls = ReturnType<typeof useSourceSinkControls>;