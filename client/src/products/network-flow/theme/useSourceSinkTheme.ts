import { useTheme } from "@graph/themes/useTheme";
import type { GNode, Graph } from "@graph/types";
import colors from "@utils/colors";
import { FLOW_USETHEME_ID, SINK_LABEL, SOURCE_LABEL } from "../constants";
import state from "../state";

/**
 * hooks into the graph with useTheme to color and label the source and sink nodes
 */
export const useSourceSinkStyler = (graph: Graph, themeId = FLOW_USETHEME_ID) => {
  const { setTheme, removeTheme } = useTheme(graph, themeId);
  const { sourceNode, sinkNode } = state

  const colorSourceSink = (node: GNode) => {
    if (graph.isFocused(node.id)) return
    const isSource = sourceNode.value?.id === node.id;
    const isSink = sinkNode.value?.id === node.id;
    if (isSource) return colors.BLUE_600;
    else if (isSink) return colors.RED_600;
  }

  const labelSourceSink = (node: GNode) => {
    if (graph.isFocused(node.id)) return
    const isSource = sourceNode.value?.id === node.id;
    const isSink = sinkNode.value?.id === node.id;
    if (isSource) return SOURCE_LABEL;
    else if (isSink) return SINK_LABEL;
  }

  const stylize = () => {
    setTheme('nodeBorderColor', colorSourceSink);
    setTheme('nodeAnchorColor', colorSourceSink);
    setTheme('nodeText', labelSourceSink);
  }

  const destylize = () => {
    removeTheme('nodeBorderColor');
    removeTheme('nodeAnchorColor');
    removeTheme('nodeText');
  }

  return {
    stylize,
    destylize,
  }
};