import type { Ref } from 'vue'
import { THEMES } from '@graph/themes'
import type { GraphOptions } from '@graph/types'
import { useUserPreferredTheme } from '@graph/themes/useUserPreferredTheme'
import { clone } from '@utils/clone'
import { usePersistentGraph } from './compositions/usePersistentGraph'

/**
 * a package full of tools for creating and managing graphs
 *
 * @param canvas - the HTML canvas element to render the graph on
 * @param options - the options for the graph including themes and settings
 * @returns a graph instance with APIs for managing the graph
 */
export const useGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<GraphOptions> = {},
) => {
  // const overrideThemes = clone(options?.theme ?? {})
  // const graph = usePersistentGraph(canvas, options)
  // useUserPreferredTheme(graph, overrideThemes)
  // return graph
  return useDarkGraph(canvas, options)
}

export const useDarkGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<GraphOptions> = {},
) => usePersistentGraph(canvas, {
  theme: {
    ...options.theme,
    ...THEMES.dark,
  },
  settings: options.settings,
})