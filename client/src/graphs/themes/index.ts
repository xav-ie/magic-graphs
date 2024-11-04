import type {
  GNode,
  NodeGetterOrValue,
  EdgeGetterOrValue,
  GEdge,
  MaybeGetter
} from "@graph/types"
import type { SupportedNodeShapes } from "@graph/schematics/node"
import type { TextFontWeight } from "@shape/types"
import colors from "@colors"
import type { ThemeGetter } from "@graph/helpers"
import type { NodeAnchor } from "@graph/compositions/useNodeAnchorGraph"

export type BaseGraphNodeTheme = {
  nodeSize: number,
  nodeBorderWidth: number,
  nodeColor: string,
  nodeBorderColor: string,
  nodeFocusColor: string,
  nodeFocusBorderColor: string,
  nodeText: string,
  nodeFocusTextColor: string,
  nodeTextSize: number,
  nodeTextColor: string,
  nodeShape: SupportedNodeShapes,
}

export type BaseGraphEdgeTheme = {
  edgeColor: string,
  edgeWidth: number,
  edgeTextSize: number,
  edgeTextColor: string,
  edgeFocusTextColor: string,
  edgeTextFontWeight: TextFontWeight,
  edgeFocusColor: string,
}

type WrapWithNodeGetter<T extends Record<string, any>> = {
  [K in keyof T]: NodeGetterOrValue<T[K]>
}

type WrapWithEdgeGetter<T extends Record<string, any>> = {
  [K in keyof T]: EdgeGetterOrValue<T[K]>
}

export type BaseGraphTheme = WrapWithNodeGetter<BaseGraphNodeTheme> & WrapWithEdgeGetter<BaseGraphEdgeTheme> & {
  graphBgColor: string,
  graphBgPatternColor: string,
}

export type NodeAnchorGraphTheme = {
  nodeAnchorRadius: NodeGetterOrValue<number>;
  nodeAnchorColor: NodeGetterOrValue<string>;
  nodeAnchorColorWhenParentFocused: NodeGetterOrValue<string>;
  linkPreviewColor: MaybeGetter<string, [GNode, NodeAnchor]>;
  linkPreviewWidth: MaybeGetter<number, [GNode, NodeAnchor]>;
}

export type GraphTheme = NodeAnchorGraphTheme & BaseGraphTheme
export type GraphThemeKey = keyof GraphTheme

export const DEFAULT_THEME: BaseGraphTheme = {
  nodeSize: 35,
  nodeBorderWidth: 8,
  nodeColor: colors.GRAY_50,
  nodeBorderColor: colors.GRAY_800,
  nodeFocusBorderColor: colors.BLUE_600,
  nodeFocusColor: colors.BLUE_100,
  nodeText: ({ label }: GNode) => label,
  nodeTextSize: 24,
  nodeTextColor: colors.GRAY_900,
  nodeFocusTextColor: colors.GRAY_900,
  nodeShape: 'circle',
  edgeColor: colors.GRAY_800,
  edgeWidth: 10,
  edgeTextSize: 20,
  edgeTextFontWeight: 'bold',
  edgeTextColor: colors.GRAY_900,
  edgeFocusColor: colors.BLUE_600,
  edgeFocusTextColor: colors.BLACK,
  graphBgColor: colors.GRAY_200,
  graphBgPatternColor: colors.BLACK + '15',
} as const

// TODO replace any with the type of the top level theme
export type GraphThemes = Record<string, any>

// ISSUE #17 GITHUB
const resolveTheme = () => {}

const REDDISH_GRAY = 'rgb(100, 60, 70)'

export const themes = {
  default: {
    ...DEFAULT_THEME,
    nodeAnchorColor: colors.BLACK,
    nodeAnchorColorWhenParentFocused: colors.BLUE_900,
  },
  dark: {
    nodeBorderColor: colors.BLACK,
    nodeColor: colors.STONE_600,
    nodeTextColor: colors.WHITE,
    nodeFocusBorderColor: colors.RED_700,
    nodeFocusColor: REDDISH_GRAY,
    nodeFocusTextColor: colors.WHITE,
    nodeAnchorColor: colors.GRAY_900,
    nodeAnchorColorWhenParentFocused: colors.RED_800,
    edgeColor: colors.STONE_900,
    edgeFocusColor: colors.RED_700,
    // TODO BOOO!!!!
    edgeTextColor: colors.WHITE,
    edgeFocusTextColor: colors.WHITE,

    graphBgColor: colors.GRAY_600,
    graphBgPatternColor: colors.WHITE + '15',
  },
} as const

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