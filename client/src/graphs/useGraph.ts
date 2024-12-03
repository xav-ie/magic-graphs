import type { Ref } from 'vue'
import { THEMES } from '@graph/themes'
import type { GraphOptions } from '@graph/types'
import { useUserPreferredTheme } from '@graph/themes/useUserPreferredTheme'
import { useGraphHelpers } from '@graph/helpers/useGraphHelpers'
import { clone } from '@utils/clone'
import { usePersistent } from './plugins/persistent'

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
  const graph = usePersistent(canvas, options)
  const helpers = useGraphHelpers(graph)

  const graphWithHelpers = {
    ...graph,
    helpers,
  }

  const overrideThemes = clone(options?.theme ?? {})
  useUserPreferredTheme(graphWithHelpers, overrideThemes)

  return graphWithHelpers
}

export const useDarkGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<GraphOptions> = {},
) => usePersistent(canvas, {
  theme: {
    ...options.theme,
    ...THEMES.dark,
  },
  settings: options.settings,
})