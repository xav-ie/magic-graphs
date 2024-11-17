import { ref } from "vue";
import type { GNode, Graph } from "@graph/types";
import { useTheme } from "@graph/themes/useTheme";
import colors from "@utils/colors";
import { LETTERS, graphLabelGetter } from "@graph/labels";
import { selectNode } from "@graph/select";
import type { SelectControls } from "@graph/select";

export const SOURCE_LABEL = "S";
export const SINK_LABEL = "T";

const ALPHABET_WITHOUT_SOURCE_SINK = LETTERS.filter(l => l !== SOURCE_LABEL && l !== SINK_LABEL);

/**
 * labeller for flow network nodes
 */
export const flowNodeLabelGetter = (graph: Pick<Graph, 'nodes'>) => {
  return graphLabelGetter(graph.nodes, ALPHABET_WITHOUT_SOURCE_SINK);
}

export const useFlowControls = (graph: Graph) => {

  const { setTheme } = useTheme(graph, 'flow');
  const newNodeLabel = flowNodeLabelGetter(graph);

  const makeSourceRejector = ref<SelectControls['cancel']>();
  const makeSource = async () => {
    const { promise, cancel } = selectNode(graph);
    makeSourceRejector.value = cancel;
    const nodeSchema = await promise;
    if (!nodeSchema) return makeSourceRejector.value = undefined;
    const node = graph.getNode(nodeSchema.id);
    if (!node) throw new Error('illegitimate schema item returned from selectNode');
    graph.nodes.value.forEach(node => {
      if (node.label === SOURCE_LABEL) node.label = newNodeLabel();
    });
    node.label = SOURCE_LABEL;
    graph.trackGraphState();
    makeSourceRejector.value = undefined;
  }

  const makeSinkRejector = ref<SelectControls['cancel']>();
  const makeSink = async () => {
    const { promise, cancel } = selectNode(graph);
    makeSinkRejector.value = cancel;
    const nodeSchema = await promise;
    if (!nodeSchema) return makeSinkRejector.value = undefined;
    const node = graph.getNode(nodeSchema.id);
    if (!node) throw new Error('illegitimate schema item returned from selectNode');
    graph.nodes.value.forEach(node => {
      if (node.label === SINK_LABEL) node.label = newNodeLabel();
    });
    node.label = SINK_LABEL;
    graph.trackGraphState();
    makeSinkRejector.value = undefined;
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

    makeSourceRejector,
    makeSinkRejector,
  }
};

export type NetworkFlowControls = ReturnType<typeof useFlowControls>;