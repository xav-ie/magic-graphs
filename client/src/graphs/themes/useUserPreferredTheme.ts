import { watch } from "vue"
import { useDark } from "@vueuse/core"
import { THEMES } from "@graph/themes"
import type { BaseGraph } from "@graph/base"

/**
 * uses the user's system preference to toggle between dark and light mode on the graph
 *
 * @param graph the graph instance
 */
export const useUserPreferredTheme = (graph: BaseGraph) => {
  const isDark = useDark()
  watch(isDark, () => {
    const currTheme = graph.theme.value
    if (isDark.value) {
      Object.assign(currTheme, THEMES.dark)
    } else {
      Object.assign(currTheme, THEMES.light)
    }
  }, { immediate: true })
}