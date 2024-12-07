import { watch } from "vue"
import { useDark } from "@vueuse/core"
import type { BaseGraph } from "@graph/base"
import { useLocalStorage } from "@vueuse/core"
import type { GraphThemeName } from "."
import type { Graph } from "@graph/types"

export type PreferredGraphTheme = GraphThemeName | 'system'

const DEFAULT_THEME: PreferredGraphTheme = 'system'

/**
 * creates a `ref` that when changed updates the {@link Graph.themeName | graph theme} and saves the preference
 * to local storage for future sessions or when another graph is created that implements
 * `usePreferredTheme`
 *
 * @param graph the graph instance
 */
export const usePreferredTheme = (graph: BaseGraph) => {
  const isDark = useDark()
  const preferredTheme = useLocalStorage<PreferredGraphTheme>('selectedTheme', DEFAULT_THEME)

  watch(isDark, () => {
    if (preferredTheme.value !== 'system') return
    graph.themeName.value = isDark.value ? 'dark' : 'light'
  }, { immediate: true })

  watch(preferredTheme, () => {
    if (preferredTheme.value === 'system') {
      graph.themeName.value = isDark.value ? 'dark' : 'light'
    } else {
      graph.themeName.value = preferredTheme.value
    }
  }, { immediate: true })

  return {
    preferredTheme,
  }
}