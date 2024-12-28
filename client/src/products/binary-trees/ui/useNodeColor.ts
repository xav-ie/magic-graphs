import { toRef } from "vue";
import type { MaybeRefOrGetter } from "vue";
import type { GNode, Graph } from "@graph/types";
import { useTheme } from "@graph/themes/useTheme";
import type { Color } from "@utils/colors";

type ColorMap = Map<GNode['id'], Color>

const DEFAULT_USETHEME_ID = 'node-colorer'

export const useNodeColor = (
  graph: Graph,
  map: MaybeRefOrGetter<ColorMap>,
  themeId = DEFAULT_USETHEME_ID
) => {
  const mapRef = toRef(map)

  const { setTheme, removeTheme } = useTheme(graph, themeId)

  const nodeColor = (node: GNode) => {
    if (graph.focus.isFocused(node.id)) return
    return mapRef.value.get(node.id)
  }

  const color = () => {
    setTheme('nodeBorderColor', nodeColor)
    setTheme('nodeAnchorColor', nodeColor)
  }

  const uncolor = () => {
    removeTheme('nodeBorderColor')
    removeTheme('nodeAnchorColor')
  }

  return {
    color,
    uncolor,
    map: mapRef,
  }
}