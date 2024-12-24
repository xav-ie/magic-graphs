import { ref } from "vue";
import { useTheme } from "@graph/themes/useTheme";
import type { GNode, Graph } from "@graph/types";
import colors from "@utils/colors";

const TARGET_COLOR = colors.AMBER_600;

export const useTargetNodeColor = (graph: Graph) => {
  const { setTheme, removeAllThemes } = useTheme(graph, "tree");

  const targetNode = ref<GNode>();

  const colorNode = (node: GNode) => {
    if (!targetNode.value) return;

    if (graph.focus.isFocused(node.id)) return;
    if (node.id === targetNode.value.id) return TARGET_COLOR;
  }

  const activate = (node?: GNode) => {
    if (node) targetNode.value = node;
    setTheme("nodeBorderColor", colorNode);
    setTheme("nodeAnchorColor", colorNode);
  }

  const deactivate = () => {
    targetNode.value = undefined;
    removeAllThemes();
  }

  return {
    activate,
    deactivate,
    targetNode,
  };
};