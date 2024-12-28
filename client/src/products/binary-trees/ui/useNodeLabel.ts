import { toRef } from "vue";
import type { MaybeRefOrGetter } from "vue";
import type { GNode, Graph } from "@graph/types";
import { useTheme } from "@graph/themes/useTheme";

/**
 * all types that we accept as a valid serializable label
 */
type LabelLike = string | number | boolean

type LabelMap = Map<GNode['id'], LabelLike>

const DEFAULT_USETHEME_ID = 'node-labeller'

export const useNodeLabel = (
  graph: Graph,
  map: MaybeRefOrGetter<LabelMap>,
  themeId = DEFAULT_USETHEME_ID
) => {
  const mapRef = toRef(map)

  const { setTheme, removeTheme } = useTheme(graph, themeId)

  const nodeText = (node: GNode) => {
    if (graph.focus.isFocused(node.id)) return
    const label = mapRef.value.get(node.id)
    if (label === undefined) return
    return label.toString()
  }

  const label = () => {
    setTheme('nodeText', nodeText)
  }

  const unlabel = () => {
    removeTheme('nodeText')
  }

  return {
    label,
    unlabel,
    map: mapRef,
  }
}