import { ref } from "vue";
import type { GNode, Graph } from "@graph/types";
import { useTheme } from "@graph/themes/useTheme";
import colors from "@utils/colors";
import { LETTERS, graphLabelGetter } from "@graph/labels";

export const SOURCE_LABEL = "S";
export const SINK_LABEL = "T";
const ALPHABET_WITHOUT_SOURCE_SINK = LETTERS.filter(l => l !== SOURCE_LABEL && l !== SINK_LABEL);

export const useFlowControls = (graph: Graph) => {

  const { setTheme } = useTheme(graph, 'flow');

  const getNewLabel = graphLabelGetter(graph.nodes, ALPHABET_WITHOUT_SOURCE_SINK);

  graph.subscribe('onNodeAdded', (node) => {
    node.label = getNewLabel();
  })

  graph.subscribe('onEdgeAdded', (edge) => {
    if (edge.to === edge.from) return graph.removeEdge(edge.id);
    const edgeAlreadyOnPath = graph.edges.value.some(e => e.from === edge.to && e.to === edge.from);
    if (edgeAlreadyOnPath) return graph.removeEdge(edge.id);
  })

  const captureNodeFn = (res: (value: GNode | PromiseLike<GNode>) => void) => (event: MouseEvent) => {
    const { offsetX, offsetY } = event;
    const node = graph.getNodeByCoordinates(offsetX, offsetY);
    if (node) res(node);
  }

  const captureNode = async () => {
    graph.settings.value.userEditable = false;
    graph.settings.value.focusable = false;
    let captureFn;
    const node = await new Promise<GNode>((res) => {
      captureFn = captureNodeFn(res);
      graph.subscribe('onClick', captureFn);
    });
    if (captureFn) graph.unsubscribe('onClick', captureFn);
    graph.settings.value.userEditable = true;
    graph.settings.value.focusable = true;
    return node;
  }

  const makingSource = ref(false);
  const makeSource = async () => {
    makingSource.value = true;
    const node = await captureNode();
    graph.nodes.value.forEach(node => {
      if (node.label === SOURCE_LABEL) node.label = getNewLabel();
    });
    node.label = SOURCE_LABEL;
    graph.trackGraphState();
    makingSource.value = false;
  }

  const makingSink = ref(false);
  const makeSink = async () => {
    makingSink.value = true;
    const node = await captureNode();
    graph.nodes.value.forEach(node => {
      if (node.label === SINK_LABEL) node.label = getNewLabel();
    });
    node.label = SINK_LABEL;
    graph.trackGraphState();
    makingSink.value = false;
  }

  const colorSourceAndSink = (node: GNode) => {
    if (graph.isHighlighted(node.id)) return
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

    makingSource,
    makingSink,
  }
};

export type NetworkFlowControls = ReturnType<typeof useFlowControls>;