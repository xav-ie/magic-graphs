import type { GNode, NodeGetterOrValue, EdgeGetterOrValue } from "./types"
import type { SupportedNodeShapes } from "./schematics/node"
import type { TextFontWeight } from "@/shapes/types"
import {
  BLACK,
  WHITE,
  STONE_600,
  STONE_900,
  GRAY_50,
  GRAY_200,
  GRAY_600,
  GRAY_800,
  GRAY_900,
  BLUE_100,
  BLUE_600,
  BLUE_900,
  RED_700,
  RED_800,
} from "@/utils/colors"
import type { Graph } from "./useGraph"
import { useDark } from "@vueuse/core"
import { watch, type UnwrapRef } from "vue"

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
}

const INITIAL_THEME_MAP = new Map<keyof GraphTheme, BaseGraphTheme>()

export const DEFAULT_THEME: BaseGraphTheme = {
  nodeSize: 35,
  nodeBorderWidth: 8,
  nodeColor: GRAY_50,
  nodeBorderColor: GRAY_800,
  nodeFocusBorderColor: BLUE_600,
  nodeFocusColor: BLUE_100,
  nodeText: ({ label }: GNode) => label,
  nodeTextSize: 24,
  nodeTextColor: GRAY_900,
  nodeFocusTextColor: GRAY_900,
  nodeShape: 'circle',
  edgeColor: GRAY_800,
  edgeWidth: 10,
  edgeTextSize: 20,
  edgeTextFontWeight: 'bold',
  edgeTextColor: GRAY_900,
  edgeFocusColor: BLUE_600,
  edgeFocusTextColor: BLACK,
  graphBgColor: GRAY_200,
} as const

// TODO replace any with the type of the top level theme
export type GraphThemes = Record<string, any>

// ISSUE #17 GITHUB
const resolveTheme = () => {}

const REDDISH_GRAY = 'rgb(100, 60, 70)'

export const themes = {
  default: {
    ...DEFAULT_THEME,
    nodeAnchorColor: BLACK,
    nodeAnchorColorWhenParentFocused: BLUE_900,
  },
  dark: {
    nodeBorderColor: BLACK,
    nodeColor: STONE_600,
    nodeTextColor: WHITE,
    nodeFocusBorderColor: RED_700,
    nodeFocusColor: REDDISH_GRAY,
    nodeFocusTextColor: WHITE,
    nodeAnchorColor: GRAY_900,
    nodeAnchorColorWhenParentFocused: RED_800,
    edgeColor: STONE_900,
    edgeFocusColor: RED_700,
    // TODO BOOO!!!!
    edgeTextColor: WHITE,
    edgeFocusTextColor: WHITE,
    graphBgColor: GRAY_600,
  },
} as const

/**
 * WARNING - EXPERIMENTAL
 * uses the user's system preference to toggle between dark and light mode on the graph
 *
 * @param graph the graph instance
 */
export const useUserPreferredTheme = (graph: Graph) => {
  const isDark = useDark()
  watch(isDark, () => {
    const currTheme = graph.theme.value
    if (isDark.value) {
      Object.assign(currTheme, themes.dark)
    } else {
      Object.assign(currTheme, themes.default)
    }
  }, { immediate: true })
}