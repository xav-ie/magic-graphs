import type { Ref } from "vue";
import { useTheme } from "@graph/themes/useTheme";
import type { GNode, Graph } from "@graph/types";
import colors from "@utils/colors";
import { FLOW_USETHEME_ID } from "./constants";

export const useFlowColorizer = (graph: Graph, { source, sink }: {
  source: Ref<GNode | undefined>;
  sink: Ref<GNode | undefined>;
}) => {
  const { setTheme, removeTheme } = useTheme(graph, FLOW_USETHEME_ID);

  const colorSourceSink = (node: GNode) => {
    if (graph.isFocused(node.id)) return
    const isSource = source.value?.id === node.id;
    const isSink = sink.value?.id === node.id;
    if (isSource) return colors.BLUE_600;
    else if (isSink) return colors.RED_600;
  }

  const colorize = () => {
    setTheme('nodeBorderColor', colorSourceSink);
    setTheme('nodeAnchorColor', colorSourceSink);
  }

  const decolorize = () => {
    removeTheme('nodeBorderColor');
    removeTheme('nodeAnchorColor');
  }

  return {
    colorize,
    decolorize,
  }
};