import { getValue } from "@graph/helpers";
import { useTheme } from "@graph/themes/useTheme";
import type { GEdge, GNode, Graph } from "@graph/types";
import colors, { adjustHex } from "@utils/colors";
import type { Color } from "@utils/colors";
import { useLocalStorage } from "@vueuse/core";

const MARKUP_USETHEME_ID = "markup";

type ColorMapKey = GNode['id'] | GEdge['id'];
type ColorMapValue = Color;
export type ColorMap = Map<ColorMapKey, ColorMapValue>;

export const useMarkupColorizer = (graph: Graph) => {
  const { setTheme, removeAllThemes } = useTheme(graph, MARKUP_USETHEME_ID);

  const colorMap = useLocalStorage('markup-color-map', new Map<ColorMapKey, ColorMapValue>());

  // go through all keys in the colorMap and remove inactive nodes/edges
  // for (const key of colorMap.value.keys()) {
  //   if (!graph.nodes.value[key] && !graph.edges.value[key]) {
  //     colorMap.value.delete(key);
  //   }
  // }

  const colorNode = (node: GNode) => {
    const color = colorMap.value.get(node.id);
    if (!color) return;
    return getValue(graph.theme.value.nodeColor, node);
  }

  const colorNodeBorder = (node: GNode) => {
    const color = colorMap.value.get(node.id);
    if (!color) return;
    if (graph.isFocused(node.id)) return adjustHex(color, 30);
    return color;
  }

  const colorEdge = (edge: GEdge) => {
    const color = colorMap.value.get(edge.id);
    if (!color) return;
    if (graph.isFocused(edge.id)) return adjustHex(color, 30);
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

export type MarkupColorizerControls = ReturnType<typeof useMarkupColorizer>;