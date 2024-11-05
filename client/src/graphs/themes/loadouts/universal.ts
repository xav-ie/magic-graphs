import type { GraphTheme } from "@graph/themes";

export type NonColorGraphThemes = Pick<
  GraphTheme,
  'nodeShape' |
  'nodeSize' |
  'nodeBorderWidth' |
  'nodeTextSize' |
  'nodeAnchorRadius' |
  'edgeWidth' |
  'edgeTextSize' |
  'nodeText' |
  'edgeTextFontWeight' |
  'linkPreviewWidth'
>

/**
 * themes that do not depend on color scheme
 */
export const NON_COLOR_THEMES: NonColorGraphThemes = {
  nodeShape: 'circle',
  nodeSize: 35,
  nodeBorderWidth: 8,
  nodeTextSize: 24,
  // Math.ceil(Math.sqrt(nodeSize) * 2)
  nodeAnchorRadius: Math.ceil(Math.sqrt(35) * 2),
  edgeWidth: 10,
  edgeTextSize: 20,
  nodeText: ({ label }) => label,
  edgeTextFontWeight: 'bold',
  linkPreviewWidth: 10,
}