import { watch } from "vue"
import { useDark } from "@vueuse/core"
import type { Graph } from "@graph/useGraph"
import { themes } from "./index"

/**
 * WARNING - EXPERIMENTAL
 * uses the user's system preference to toggle between dark and light mode on the graph
 *
 * @param graph the graph instance
 */
export const useUserPreferredTheme = (graph: Graph) => {
  const isDark = useDark()
  watch(isDark, () => {
    const currTheme = graph.theme.value
    if (isDark.value) {
      Object.assign(currTheme, themes.dark)
    } else {
      Object.assign(currTheme, themes.default)
    }
  }, { immediate: true })
}