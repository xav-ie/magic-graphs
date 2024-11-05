import type { GNode, GEdge } from "@graph/types"
import type { ThemeGetter } from "@graph/helpers"
import type {
  BaseGraphEdgeTheme,
  BaseGraphNodeTheme,
  GraphTheme as GraphThemeImport,
} from "./types"
import { DARK_THEME } from "./loadouts/dark"
import { LIGHT_THEME } from "./loadouts/light"

export type GraphTheme = GraphThemeImport

export const THEMES = {
  default: LIGHT_THEME,
  dark: DARK_THEME,
} as const satisfies Record<string, GraphTheme>

/**
 * gets the theme attributes for a GNode at the point in time the function is called
 *
 * @param getTheme - the theme getter function
 * @param node - the node to get the theme for
 * @returns the theme attributes for the node
 */
export const resolveThemeForNode = (getTheme: ThemeGetter, node: GNode): BaseGraphNodeTheme => ({
  nodeSize: getTheme('nodeSize', node),
  nodeBorderWidth: getTheme('nodeBorderWidth', node),
  nodeColor: getTheme('nodeColor', node),
  nodeBorderColor: getTheme('nodeBorderColor', node),
  nodeFocusColor: getTheme('nodeFocusColor', node),
  nodeFocusBorderColor: getTheme('nodeFocusBorderColor', node),
  nodeTextSize: getTheme('nodeTextSize', node),
  nodeTextColor: getTheme('nodeTextColor', node),
  nodeFocusTextColor: getTheme('nodeFocusTextColor', node),
  nodeText: getTheme('nodeText', node),
  nodeShape: getTheme('nodeShape', node),
})

/**
 * gets the theme attributes for a GEdge at the point in time the function is called
 *
 * @param getTheme - the theme getter function
 * @param edge - the edge to get the theme for
 * @returns the theme attributes for the edge
 */
export const resolveThemeForEdge = (getTheme: ThemeGetter, edge: GEdge): BaseGraphEdgeTheme => ({
  edgeWidth: getTheme('edgeWidth', edge),
  edgeColor: getTheme('edgeColor', edge),
  edgeTextSize: getTheme('edgeTextSize', edge),
  edgeTextColor: getTheme('edgeTextColor', edge),
  edgeFocusColor: getTheme('edgeFocusColor', edge),
  edgeFocusTextColor: getTheme('edgeFocusTextColor', edge),
  edgeTextFontWeight: getTheme('edgeTextFontWeight', edge),
})