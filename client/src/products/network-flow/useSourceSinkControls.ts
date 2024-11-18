import { ref } from "vue";
import type { Ref } from "vue";
import type { GNode, Graph } from "@graph/types";
import { LETTERS, graphLabelGetter } from "@graph/labels";
import { selectNode } from "@graph/select";
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
  const newNodeLabel = flowNodeLabelGetter(graph);

  const initialSource = graph.nodes.value.find(node => node.label === SOURCE_LABEL);
  const initialSink = graph.nodes.value.find(node => node.label === SINK_LABEL);

  const sourceNode = ref<GNode | undefined>(initialSource);
  const sinkNode = ref<GNode | undefined>(initialSink);

  const cancelSetSourceNode = ref<SelectControls['cancelSelection']>();
  const cancelSetSinkNode = ref<SelectControls['cancelSelection']>();

  const nodeSelector = async (
    nodeRef: Ref<GNode | undefined>,
    cancelRef: Ref<SelectControls['cancelSelection'] | undefined>,
    selectedNodeLabel: string,
  ) => {
    const { selectedItemPromise, cancelSelection } = selectNode(graph);
    cancelRef.value = cancelSelection;

    const nodeSchema = await selectedItemPromise;
    if (!nodeSchema) return cancelRef.value = undefined; // cancelled

    const node = graph.getNode(nodeSchema.id);
    if (!node) throw new Error('illegitimate schema item returned from selectNode');

    if (nodeRef.value) nodeRef.value.label = newNodeLabel();

    nodeRef.value = node;
    nodeRef.value.label = selectedNodeLabel;

    cancelRef.value = undefined;
    graph.trackGraphState();
  }

  return {
    source: sourceNode,
    sink: sinkNode,

    setSourceNode: () => nodeSelector(sourceNode, cancelSetSourceNode, SOURCE_LABEL),
    setSinkNode: () => nodeSelector(sinkNode, cancelSetSinkNode, SINK_LABEL),

    cancelSetSourceNode,
    cancelSetSinkNode,
  }
};

export type SourceSinkControls = ReturnType<typeof useSourceSinkControls>;