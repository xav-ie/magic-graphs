import { onUnmounted } from "vue";
import type { Graph } from "@graph/types";
import type {
  GraphTheme,
  GraphThemeKey,
} from "@graph/themes/types";

type ThemeableGraph = Pick<Graph, 'themeMap'>

export const useTheme = <G extends ThemeableGraph>(graph: G, themeId: string) => {

  const setTheme = <T extends GraphThemeKey>(prop: T, value: GraphTheme[T]) => {
    removeTheme(prop)
    const themeMapEntries = graph.themeMap[prop]
    themeMapEntries.push({
      value,
      useThemeId: themeId
    })
  }

  const removeTheme = (prop: GraphThemeKey) => {
    const themeMapEntries = graph.themeMap[prop]
    const index = themeMapEntries.findIndex(entry => entry.useThemeId === themeId)
    if (index !== -1) themeMapEntries.splice(index, 1)
  }

  const removeAllThemes = () => {
    const themeProps = Object.keys(graph.themeMap) as GraphThemeKey[]
    for (const prop of themeProps) removeTheme(prop)
  }

  onUnmounted(removeAllThemes)

  return {
    setTheme,
    removeTheme,
    removeAllThemes,
  }
}