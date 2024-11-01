import type { NodeAnchorGraphTheme } from "@graph/compositions/useNodeAnchorGraph"
import type { MaybeGetter, MaybeGetterParams, UnwrapMaybeGetter } from "@graph/types"

export type GraphTheme = NodeAnchorGraphTheme
export type GraphThemeKey = keyof GraphTheme

/**
 * decomposes MaybeGetter<T, K> such that it turns T into T | void
 */
export type MaybeGetterOrVoid<T> = MaybeGetter<UnwrapMaybeGetter<T> | void, MaybeGetterParams<T>>

export type ThemeMapEntry<T extends GraphThemeKey> = {
  value: MaybeGetterOrVoid<GraphTheme[T]>,
  useThemeId: string,
}

export type FullThemeMap = {
  [K in GraphThemeKey]: ThemeMapEntry<K>[]
}

export type PartialThemeMap = Partial<FullThemeMap>

export const getInitialThemeMap = () => ({
  /**
   * base themes
   */
  nodeSize: [],
  nodeBorderWidth: [],
  nodeColor: [],
  nodeBorderColor: [],
  nodeFocusColor: [],
  nodeFocusBorderColor: [],
  nodeText: [],
  nodeFocusTextColor: [],
  nodeTextSize: [],
  nodeTextColor: [],
  nodeShape: [],
  edgeColor: [],
  edgeWidth: [],
  edgeTextSize: [],
  edgeTextColor: [],
  edgeFocusTextColor: [],
  edgeTextFontWeight: [],
  edgeFocusColor: [],

  graphBgColor: [],
  graphBgPatternColor: [],

  /**
   * node anchor themes
   */
  nodeAnchorRadius: [],
  nodeAnchorColor: [],
  nodeAnchorColorWhenParentFocused: [],
  linkPreviewColor: [],
  linkPreviewWidth: [],
} as FullThemeMap)
