/**
 * @module useGraph
 *
 * This is where the final layer of composition happens. Where the theme meets the graph and the alias is created.
 * Consumers of the useGraph API import from this file.
 */

import { type Ref } from 'vue'
import { themes } from './themes'
import {
  usePersistentGraph,
  type PersistentGraphOptions,
} from './usePersistentGraph'

export const useGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<PersistentGraphOptions> = {},
) => usePersistentGraph(canvas, options)

export const useDarkGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<PersistentGraphOptions> = {},
) => usePersistentGraph(canvas, {
  theme: {
    ...options.theme,
    ...themes.dark,
  },
  settings: options.settings,
})

export type Graph = ReturnType<typeof useGraph>