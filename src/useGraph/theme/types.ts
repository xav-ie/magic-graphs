import type { UnwrapRef } from "vue"
import type { Graph } from "../useGraph"

export type GraphTheme = UnwrapRef<Graph['theme']>

export type ThemeKey = keyof GraphTheme

export type FullThemeMap = {
  [K in ThemeKey]: GraphTheme[K][]
}

export type PartialThemeMap = Partial<FullThemeMap>

export const themeMap: FullThemeMap = {
  /**
   * base themes
   */
  nodeSize: [] as GraphTheme['nodeSize'][],
  nodeBorderWidth: [] as GraphTheme['nodeBorderWidth'][],
  nodeColor: [] as GraphTheme['nodeColor'][],
  nodeBorderColor: [] as GraphTheme['nodeBorderColor'][],
  nodeFocusColor: [] as GraphTheme['nodeFocusColor'][],
  nodeFocusBorderColor: [] as GraphTheme['nodeFocusBorderColor'][],
  nodeText: [] as GraphTheme['nodeText'][],
  nodeFocusTextColor: [] as GraphTheme['nodeFocusTextColor'][],
  nodeTextSize: [] as GraphTheme['nodeTextSize'][],
  nodeTextColor: [] as GraphTheme['nodeTextColor'][],
  nodeShape: [] as GraphTheme['nodeShape'][],
  edgeColor: [] as GraphTheme['edgeColor'][],
  edgeWidth: [] as GraphTheme['edgeWidth'][],
  edgeTextSize: [] as GraphTheme['edgeTextSize'][],
  edgeTextColor: [] as GraphTheme['edgeTextColor'][],
  edgeFocusTextColor: [] as GraphTheme['edgeFocusTextColor'][],
  edgeTextFontWeight: [] as GraphTheme['edgeTextFontWeight'][],
  edgeFocusColor: [] as GraphTheme['edgeFocusColor'][],
  graphBgColor: [] as GraphTheme['graphBgColor'][],

  /**
   * node anchor themes
   */
  nodeAnchorColor: [] as GraphTheme['nodeAnchorColor'][],
  nodeAnchorColorWhenParentFocused: [] as GraphTheme['nodeAnchorColorWhenParentFocused'][],
  nodeAnchorRadius: [] as GraphTheme['nodeAnchorRadius'][],
  linkPreviewColor: [] as GraphTheme['linkPreviewColor'][],
  linkPreviewWidth: [] as GraphTheme['linkPreviewWidth'][],
}
