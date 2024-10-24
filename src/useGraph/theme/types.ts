import type { NodeAnchorGraphTheme } from "../useNodeAnchorGraph"

export type GraphTheme = NodeAnchorGraphTheme
export type GraphThemeKey = keyof GraphTheme

export type ThemeMapEntry<T extends GraphThemeKey> = {
  value: GraphTheme[T],
  useThemeId: string,
}

export type FullThemeMap = {
  [K in GraphThemeKey]: ThemeMapEntry<K>[]
}

export type PartialThemeMap = Partial<FullThemeMap>

export const INITIAL_THEME_MAP: FullThemeMap = {
  /**
   * base themes
   */
  nodeSize: [] as ThemeMapEntry<'nodeSize'>[],
  nodeBorderWidth: [] as ThemeMapEntry<'nodeBorderWidth'>[],
  nodeColor: [] as ThemeMapEntry<'nodeColor'>[],
  nodeBorderColor: [] as ThemeMapEntry<'nodeBorderColor'>[],
  nodeFocusColor: [] as ThemeMapEntry<'nodeFocusColor'>[],
  nodeFocusBorderColor: [] as ThemeMapEntry<'nodeFocusBorderColor'>[],
  nodeText: [] as ThemeMapEntry<'nodeText'>[],
  nodeFocusTextColor: [] as ThemeMapEntry<'nodeFocusTextColor'>[],
  nodeTextSize: [] as ThemeMapEntry<'nodeTextSize'>[],
  nodeTextColor: [] as ThemeMapEntry<'nodeTextColor'>[],
  nodeShape: [] as ThemeMapEntry<'nodeShape'>[],
  edgeColor: [] as ThemeMapEntry<'edgeColor'>[],
  edgeWidth: [] as ThemeMapEntry<'edgeWidth'>[],
  edgeTextSize: [] as ThemeMapEntry<'edgeTextSize'>[],
  edgeTextColor: [] as ThemeMapEntry<'edgeTextColor'>[],
  edgeFocusTextColor: [] as ThemeMapEntry<'edgeFocusTextColor'>[],
  edgeTextFontWeight: [] as ThemeMapEntry<'edgeTextFontWeight'>[],
  edgeFocusColor: [] as ThemeMapEntry<'edgeFocusColor'>[],
  graphBgColor: [] as ThemeMapEntry<'graphBgColor'>[],

  /**
   * node anchor themes
   */
  nodeAnchorRadius: [] as ThemeMapEntry<'nodeAnchorRadius'>[],
  nodeAnchorColor: [] as ThemeMapEntry<'nodeAnchorColor'>[],
  nodeAnchorColorWhenParentFocused: [] as ThemeMapEntry<'nodeAnchorColorWhenParentFocused'>[],
  linkPreviewColor: [] as ThemeMapEntry<'linkPreviewColor'>[],
  linkPreviewWidth: [] as ThemeMapEntry<'linkPreviewWidth'>[],
}
