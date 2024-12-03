import { watch } from "vue"
import { useDark } from "@vueuse/core"
import { THEMES } from "@graph/themes"
import type { GraphTheme } from "./types"
import type { BaseGraph } from "@graph/base"

/**
 * WARNING - EXPERIMENTAL
 * uses the user's system preference to toggle between dark and light mode on the graph
 *
 * @param graph the graph instance
 * @param overrideThemes the themes to override the default light/dark themes with
 */
export const useUserPreferredTheme = (
  graph: BaseGraph,
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