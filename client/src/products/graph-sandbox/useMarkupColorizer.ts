import { getValue } from "@graph/helpers";
import { useTheme } from "@graph/themes/useTheme";
import type { GEdge, GNode, Graph } from "@graph/types";
import colors, { adjustHex, darkenHex, type Color } from "@utils/colors";

const MARKUP_USETHEME_ID = "markup";

export const useMarkupColorizer = (graph: Graph) => {
  const { setTheme, removeAllThemes } = useTheme(graph, MARKUP_USETHEME_ID);

  const colorMap = new Map<GNode['id'] | GEdge['id'], Color>();

  const colorNode = (node: GNode) => {
    const color = colorMap.get(node.id);
    if (!color) return;
    return getValue(graph.theme.value.nodeColor, node);
  }

  const colorNodeBorder = (node: GNode) => {
    const color = colorMap.get(node.id);
    if (!color) return;
    if (graph.isHighlighted(node.id)) return adjustHex(color, -30);
    return color;
  }

  const colorEdge = (edge: GEdge) => {
    const color = colorMap.get(edge.id);
    if (!color) return;
    if (graph.isHighlighted(edge.id)) return adjustHex(color, -30);
    return color;
  };

  const colorize = () => {
    setTheme('nodeColor', colorNode);

    setTheme('nodeBorderColor', colorNodeBorder);
    setTheme('nodeFocusBorderColor', colorNodeBorder);
    setTheme('nodeAnchorColor', colorNodeBorder);
    setTheme('nodeAnchorColorWhenParentFocused', colorNodeBorder);
    setTheme('edgeColor', colorEdge);

    setTheme('marqueeSelectionBoxColor', colors.TRANSPARENT)
    setTheme('marqueeEncapsulatedNodeBoxBorderColor', colors.WHITE + '80')
    setTheme('marqueeEncapsulatedNodeBoxColor', colors.TRANSPARENT)
  }

  const decolorize = () => {
    removeAllThemes();
  }

  return {
    colorize,
    decolorize,
    colorMap,
  };
}