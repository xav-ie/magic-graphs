import { ref } from "vue";
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

export const useFlowControls = (graph: Graph) => {

  const { setTheme } = useTheme(graph, FLOW_USETHEME_ID);
  const newNodeLabel = flowNodeLabelGetter(graph);

  const cancelMakeSource = ref<SelectControls['cancelSelection']>();
  const cancelMakeSink = ref<SelectControls['cancelSelection']>();

  const makeSource = async () => {
    const { selectedItemPromise, cancelSelection } = selectNode(graph);
    cancelMakeSource.value = cancelSelection;
    const nodeSchema = await selectedItemPromise;
    if (!nodeSchema) return cancelMakeSource.value = undefined;
    const node = graph.getNode(nodeSchema.id);
    if (!node) throw new Error('illegitimate schema item returned from selectNode');
    graph.nodes.value.forEach(node => {
      if (node.label === SOURCE_LABEL) node.label = newNodeLabel();
    });
    node.label = SOURCE_LABEL;
    graph.trackGraphState();
    cancelMakeSource.value = undefined;
  }

  const makeSink = async () => {
    const { selectedItemPromise, cancelSelection } = selectNode(graph);
    cancelMakeSink.value = cancelSelection;
    const nodeSchema = await selectedItemPromise;
    if (!nodeSchema) return cancelMakeSink.value = undefined;
    const node = graph.getNode(nodeSchema.id);
    if (!node) throw new Error('illegitimate schema item returned from selectNode');
    graph.nodes.value.forEach(node => {
      if (node.label === SINK_LABEL) node.label = newNodeLabel();
    });
    node.label = SINK_LABEL;
    graph.trackGraphState();
    cancelMakeSink.value = undefined;
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
    makeSource,
    makeSink,

    makeSourceRejector: cancelMakeSource,
    makeSinkRejector: cancelMakeSink,
  }
};

export type NetworkFlowControls = ReturnType<typeof useFlowControls>;