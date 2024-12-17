import type { Graph, GNode, GEdge } from "@graph/types";
import { useTheme } from "@graph/themes/useTheme";
import colors from "@utils/colors";

const USETHEME_ID = 'sim-guard-node-edge-colorizer'

const TARGET_COLOR = colors.RED_600

export const useNodeEdgeColorizer = (graph: Graph, ids: Set<GNode['id'] | GEdge['id']>) => {
  const { setTheme, removeAllThemes } = useTheme(graph, USETHEME_ID)

  const colorItem = (item: GNode | GEdge) => {
    if (ids.has(item.id)) return TARGET_COLOR
  }

  const colorize = () => {
    setTheme('edgeColor', colorItem)
    setTheme('nodeBorderColor', colorItem)
  }

  const decolorize = () => {
    removeAllThemes()
  }

  return { colorize, decolorize }
}