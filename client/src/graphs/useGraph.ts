/**
 * @module useGraph
 *
 * This is where the final layer of composition happens. Where the theme meets the graph and the alias is created.
 * Consumers of the useGraph API import from this file.
 */

import type { Ref } from 'vue'
import { THEMES } from '@graph/themes'
import { useUserPreferredTheme } from '@graph/themes/useUserPreferredTheme'
import type { PersistentGraphOptions } from '@graph/compositions/usePersistentGraph'
import { useCollaborativeGraph } from '@graph/compositions/useCollaborativeGraph'
import type { Collab}

export const useGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<PersistentGraphOptions> = {},
) => {
  const graph = useCollaborativeGraph(canvas, options)
  useUserPreferredTheme(graph)
  return graph
}

export const useDarkGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<PersistentGraphOptions> = {},
) => useCollaborativeGraph(canvas, {
  theme: {
    ...options.theme,
    ...THEMES.dark,
  },
  settings: options.settings,
})