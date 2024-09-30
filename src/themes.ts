import { type GraphOptions } from "./useGraph"

export const themes: Record<string, GraphOptions> = {
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
  },
}