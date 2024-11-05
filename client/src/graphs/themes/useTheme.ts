import { onUnmounted } from "vue";
import type { Graph } from "@graph/types";
import type { GraphThemeKey } from "@graph/themes";
import type { ThemeMapEntry } from "@graph/themes/types";

type ThemeableGraph = Pick<Graph, 'themeMap' | 'repaint'>

export const useTheme = <G extends ThemeableGraph>(graph: G, themeId: string) => {

  const setTheme = <T extends GraphThemeKey>(prop: T, value: ThemeMapEntry<T>['value']) => {
    removeTheme(prop, false)
    const themeMapEntries = graph.themeMap[prop]
    themeMapEntries.push({
      value,
      useThemeId: themeId
    })
    graph.repaint(`use-theme/set-theme/from:"${themeId}"/prop:"${prop}"`)()
  }

  const removeTheme = (prop: GraphThemeKey, repaint = true) => {
    const themeMapEntries = graph.themeMap[prop]
    const index = themeMapEntries.findIndex(entry => entry.useThemeId === themeId)
    if (index !== -1) {
      themeMapEntries.splice(index, 1)
      if (repaint) graph.repaint(`use-theme/remove-theme/from:"${themeId}"/prop:"${prop}"`)()
    }
  }

  const removeAllThemes = () => {
    const themeProps = Object.keys(graph.themeMap) as GraphThemeKey[]
    for (const prop of themeProps) removeTheme(prop, false)
    graph.repaint(`use-theme/remove-all-themes/from:"${themeId}"`)()
  }

  onUnmounted(removeAllThemes)

  return {
    setTheme,
    removeTheme,
    removeAllThemes,
  }
}