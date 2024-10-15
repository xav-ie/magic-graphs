import type { UserEditableGraphOptions } from "./useUserEditableGraph"

export const themes: Record<string, Partial<UserEditableGraphOptions>> = {
  weird: {
    nodeBorderColor: 'pink',
    nodeColor: 'brown',
    nodeTextColor: 'orange',
  },
  dark: {
    nodeBorderColor: 'rgb(25, 25, 25)',
    nodeColor: 'rgb(50, 50, 60)',
    nodeTextColor: 'white',
    edgeColor: 'rgb(25, 25, 25)',
    nodeFocusBorderColor: 'rgb(200, 0, 0)',
    nodeFocusColor: 'rgb(100, 60, 70)',
    nodeTextSize: 26,
    nodeAnchorColor: 'rgb(30, 30, 40)',
    nodeAnchorColorWhenParentFocused: 'rgb(170, 0, 0)',
    graphBgColor: 'rgb(75, 85, 99)' // tailwind bg-gray-600
  },
}