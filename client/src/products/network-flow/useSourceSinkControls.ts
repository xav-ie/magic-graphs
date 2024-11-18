import { ref, type Ref } from "vue";
import type { GNode, Graph } from "@graph/types";
import { useTheme } from "@graph/themes/useTheme";
import colors from "@utils/colors";
import { LETTERS, graphLabelGetter } from "@graph/labels";
import { selectNode } from "@graph/select";
import type { SelectControls } from "@graph/select";
import { FLOW_USETHEME_ID, SINK_LABEL, SOURCE_LABEL } from "./constants";

const ALPHABET_WITHOUT_SOURCE_SINK = LETTERS.filter(l => l !== SOURCE_LABEL && l !== SINK_LABEL);

/**
 * labeller network flow graph instances (nodes)
 */
export const flowNodeLabelGetter = (graph: Pick<Graph, 'nodes'>) => {
  return graphLabelGetter(graph.nodes, ALPHABET_WITHOUT_SOURCE_SINK);
}

export const useSourceSinkControls = (graph: Graph) => {

  const { setTheme } = useTheme(graph, FLOW_USETHEME_ID);
  const newNodeLabel = flowNodeLabelGetter(graph);

  const initialSource = graph.nodes.value.find(node => node.label === SOURCE_LABEL);
  const initialSink = graph.nodes.value.find(node => node.label === SINK_LABEL);

  const sourceNode = ref<GNode | undefined>(initialSource);
  const sinkNode = ref<GNode | undefined>(initialSink);

  const cancelSetSourceNode = ref<SelectControls['cancelSelection']>();
  const cancelSetSinkNode = ref<SelectControls['cancelSelection']>();

  const nodeSelector = async (
    nodeRef: Ref<GNode | undefined>,
    cancelRef: Ref<SelectControls['cancelSelection'] | undefined>
  ) => {
    const { selectedItemPromise, cancelSelection } = selectNode(graph);
    cancelRef.value = cancelSelection;

    const nodeSchema = await selectedItemPromise;
    if (!nodeSchema) return cancelRef.value = undefined; // cancelled

    const node = graph.getNode(nodeSchema.id);
    if (!node) throw new Error('illegitimate schema item returned from selectNode');

    if (nodeRef.value) nodeRef.value.label = newNodeLabel();

    nodeRef.value = node;
    nodeRef.value.label = SOURCE_LABEL;

    cancelRef.value = undefined;
    graph.trackGraphState();
  }

  const colorSourceAndSink = (node: GNode) => {
    if (graph.isFocused(node.id)) return
    const isSource = node.label === SOURCE_LABEL;
    const isSink = node.label === SINK_LABEL;
    if (isSource) return colors.BLUE_600;
    else if (isSink) return colors.RED_600;
  }

  setTheme('nodeBorderColor', colorSourceAndSink);
  setTheme('nodeAnchorColor', colorSourceAndSink);

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