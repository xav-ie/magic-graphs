import { useTheme } from "@graph/themes/useTheme";
import type { GEdge, GNode, Graph } from "@graph/types";
import type { Color } from "@utils/colors";

const MARKUP_USETHEME_ID = "markup";

export const useMarkupColorizer = (graph: Graph) => {
  const { setTheme, removeAllThemes } = useTheme(graph, MARKUP_USETHEME_ID);

  const colorMap = new Map<GNode['id'] | GEdge['id'], Color>();

  const colorNodeBorder = (node: GNode) => colorMap.get(node.id);
  const colorEdge = (edge: GEdge) => colorMap.get(edge.id);

  const colorize = () => {
    setTheme('nodeBorderColor', colorNodeBorder);
    setTheme('nodeFocusBorderColor', colorNodeBorder);
    setTheme('nodeAnchorColor', colorNodeBorder);
    setTheme('nodeAnchorColorWhenParentFocused', colorNodeBorder);
    setTheme('edgeColor', colorEdge);
    setTheme('edgeFocusColor', colorEdge);
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