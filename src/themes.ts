import { type GraphOptions } from "./useGraph"

export const themes: Record<string, Partial<GraphOptions>> = {
  weird: {
    nodeBorderColor: 'pink',
    nodeColor: 'brown',
    nodeTextColor: 'orange',
  },
  normal: {}
}