import type { GEdge, GNode, Graph } from "@graph/types";
import { useTheme } from "@graph/themes/useTheme";
import { MARKUP_USETHEME_ID, SIZE_TO_RADIUS, type MarkupSize } from "./types";
import { useLocalStorage } from "@vueuse/core";

type SizeMapKey = GNode['id'] | GEdge['id'];
type SizeMapValue = MarkupSize;
export type SizeMap = Map<SizeMapKey, SizeMapValue>;

export const useMarkupSizer = (graph: Graph) => {
  const { setTheme, removeAllThemes } = useTheme(graph, MARKUP_USETHEME_ID);

  const sizeMap = useLocalStorage('markup-size-map', new Map<SizeMapKey, SizeMapValue>());

  const sizeNode = (node: GNode) => {
    const size = sizeMap.value.get(node.id);
    if (!size) return;
    return SIZE_TO_RADIUS[size];
  }

  const sizeEdge = (edge: GEdge) => {
    const size = sizeMap.value.get(edge.id);
    if (!size) return;
    return SIZE_TO_RADIUS[size];
  };

  const size = () => {
    setTheme('nodeSize', sizeNode);
    setTheme('edgeWidth', sizeEdge);
  }

  const desize = () => {
    removeAllThemes();
  }

  return {
    size,
    desize,
    sizeMap
  };
};