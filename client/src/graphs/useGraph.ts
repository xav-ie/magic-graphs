import type { Ref } from 'vue'
import { THEMES } from '@graph/themes'
import type { GraphOptions } from '@graph/types'
import { useUserPreferredTheme } from '@graph/themes/useUserPreferredTheme'
import { useCollaborativeGraph } from '@graph/compositions/useCollaborativeGraph'
import { clone } from '@utils/clone'

export const useGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<GraphOptions> = {},
) => {
  const preservedTheme = clone(options?.theme ?? {})
  const graph = useCollaborativeGraph(canvas, options)
  useUserPreferredTheme(graph, preservedTheme)
  return graph
}

export const useDarkGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<GraphOptions> = {},
) => useCollaborativeGraph(canvas, {
  theme: {
    ...options.theme,
    ...THEMES.dark,
  },
  settings: options.settings,
})