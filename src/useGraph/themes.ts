import type { GNode, NodeGetterOrValue, EdgeGetterOrValue } from "./types"
import type { SupportedNodeShapes } from "./schematics/node"
import type { TextFontWeight } from "@/shapes/types"
import {
  BLACK,
  WHITE,
  BLUE_600,
  GRAY_50,
} from "@/utils/colors"

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

export const DEFAULT_THEME: BaseGraphTheme = {
  nodeSize: 35,
  nodeBorderWidth: 8,
  nodeColor: WHITE,
  nodeBorderColor: BLACK,
  nodeFocusBorderColor: BLUE_600,
  nodeFocusColor: WHITE,
  nodeText: ({ label }: GNode) => label,
  nodeTextSize: 24,
  nodeTextColor: BLACK,
  nodeFocusTextColor: BLACK,
  nodeShape: 'circle',
  edgeColor: BLACK,
  edgeWidth: 10,
  edgeTextSize: 20,
  edgeTextFontWeight: 'bold',
  edgeTextColor: BLACK,
  edgeFocusColor: BLUE_600,
  edgeFocusTextColor: BLACK,
  graphBgColor: GRAY_50,
} as const

// TODO replace any with the type of the top level theme
export type GraphThemes = Record<string, any>

// ISSUE #17 GITHUB
const resolveTheme = () => {}

export const themes = {
  default: DEFAULT_THEME,
  dark: {
    nodeBorderColor: 'rgb(25, 25, 25)',
    nodeColor: 'rgb(50, 50, 60)',
    nodeTextColor: 'white',
    nodeFocusBorderColor: 'rgb(200, 0, 0)',
    nodeFocusColor: 'rgb(100, 60, 70)',
    nodeFocusTextColor: 'white',
    nodeAnchorColor: 'rgb(30, 30, 40)',
    nodeAnchorColorWhenParentFocused: 'rgb(170, 0, 0)',
    edgeColor: 'rgb(25, 25, 25)',
    edgeFocusColor: 'rgb(200, 0, 0)',
    // TODO BOOO!!!!
    edgeTextColor: 'white',
    edgeFocusTextColor: 'white',
    graphBgColor: 'rgb(75, 85, 99)' // tailwind bg-gray-600
  },
} as const