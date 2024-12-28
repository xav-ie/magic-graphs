import { toRef } from "vue";
import type { MaybeRefOrGetter } from "vue";
import type { GNode, Graph } from "@graph/types";
import { useTheme } from "@graph/themes/useTheme";

/**
 * all types that we accept as a valid serializable label
 */
type LabelLike = string | number | boolean

type LabelMap = Map<GNode['id'], LabelLike>;
type LabelGetter = (nodeId: GNode['id']) => LabelLike;

const DEFAULT_USETHEME_ID = 'node-labeller'

export const useNodeLabel = (
  graph: Graph,
  mapOrGetter: MaybeRefOrGetter<LabelMap | LabelGetter>,
  themeId = DEFAULT_USETHEME_ID
) => {
  const mapOrGetterRef = toRef(mapOrGetter)

  const get = (nodeId: GNode['id']) => {
    const map = mapOrGetterRef.value
    if (typeof map === 'function') return map(nodeId)
    return map.get(nodeId)
  }

  const { setTheme, removeTheme } = useTheme(graph, themeId)

  const nodeText = (node: GNode) => {
    if (graph.focus.isFocused(node.id)) return
    const label = get(node.id)
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

    mapOrGetterRef,
  }
}