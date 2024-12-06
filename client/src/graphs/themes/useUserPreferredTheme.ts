import { watch } from "vue"
import { useDark } from "@vueuse/core"
import type { BaseGraph } from "@graph/base"

/**
 * uses the user's system preference to toggle between dark and light mode on the graph
 *
 * @param graph the graph instance
 */
export const useUserPreferredTheme = (graph: BaseGraph) => {
  const isDark = useDark()
  watch(isDark, () => {
    if (isDark.value) {
      graph.themeName.value = 'dark'
    } else {
      graph.themeName.value = 'light'
    }
  }, { immediate: true })
}