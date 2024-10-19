import type { UserEditableGraphOptions } from "./useUserEditableGraph"
import type { GNode, NodeGetterOrValue, EdgeGetterOrValue } from "./types"
import type { SupportedNodeShapes } from "./schematics/node"
import type { TextFontWeight } from "@/shapes/types"

export type BaseGraphTheme = {
  nodeSize: NodeGetterOrValue<number>,
  nodeBorderWidth: NodeGetterOrValue<number>,
  nodeColor: NodeGetterOrValue<string>,
  nodeBorderColor: NodeGetterOrValue<string>,
  nodeFocusColor: NodeGetterOrValue<string>,
  nodeFocusBorderColor: NodeGetterOrValue<string>,
  nodeText: NodeGetterOrValue<string>,
  nodeFocusTextColor: NodeGetterOrValue<string>,
  nodeTextSize: NodeGetterOrValue<number>,
  nodeTextColor: NodeGetterOrValue<string>,
  nodeShape: NodeGetterOrValue<SupportedNodeShapes>,
  edgeColor: EdgeGetterOrValue<string>,
  edgeWidth: EdgeGetterOrValue<number>,
  edgeTextSize: EdgeGetterOrValue<number>,
  edgeTextColor: EdgeGetterOrValue<string>,
  edgeFocusTextColor: EdgeGetterOrValue<string>,
  edgeTextFontWeight: EdgeGetterOrValue<TextFontWeight>,
  edgeFocusColor: EdgeGetterOrValue<string>,
  graphBgColor: string,
}

export const DEFAULT_THEME: BaseGraphTheme = {
  nodeSize: 35,
  nodeBorderWidth: 8,
  nodeColor: 'white',
  nodeBorderColor: 'black',
  nodeFocusBorderColor: 'blue',
  nodeFocusColor: 'white',
  nodeText: ({ label }: GNode) => label,
  nodeTextSize: 24,
  nodeTextColor: 'black',
  nodeFocusTextColor: 'black',
  nodeShape: 'circle',
  edgeColor: 'black',
  edgeWidth: 10,
  edgeTextSize: 20,
  edgeTextFontWeight: 'bold',
  edgeTextColor: 'black',
  edgeFocusColor: 'blue',
  edgeFocusTextColor: 'black',
  graphBgColor: 'white',
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