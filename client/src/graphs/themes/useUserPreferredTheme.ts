import { watch } from "vue"
import { useDark } from "@vueuse/core"
import type { Graph } from "@graph/types"
import { THEMES } from "@graph/themes"
import type { GraphTheme } from "./types"

/**
 * WARNING - EXPERIMENTAL
 * uses the user's system preference to toggle between dark and light mode on the graph
 *
 * @param graph the graph instance
 * @param overrideThemes the themes to override the default light/dark themes with
 */
export const useUserPreferredTheme = (
  graph: Graph,
  overrideThemes: Partial<GraphTheme>
) => {
  const isDark = useDark()
  watch(isDark, () => {
    const currTheme = graph.theme.value
    if (isDark.value) {
      Object.assign(currTheme, {
        ...THEMES.dark,
        ...overrideThemes,
      })
    } else {
      Object.assign(currTheme, {
        ...THEMES.light,
        ...overrideThemes,
      })
    }
  }, { immediate: true })
}