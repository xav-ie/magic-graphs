import { onUnmounted } from "vue";
import type { Graph } from "../useGraph";
import type {
  GraphTheme,
  GraphThemeKey,
} from "./types";

export const useTheme = (graph: Graph, id: string) => {

  const setTheme = <T extends GraphThemeKey>(prop: T, value: GraphTheme[T]) => {
    removeTheme(prop)
    const themeMapEntries = graph.themeMap[prop]
    console.log('setting theme', prop, value)
    themeMapEntries.push({
      value,
      useThemeId: id
    })
  }

  const removeTheme = (prop: GraphThemeKey) => {
    const themeMapEntries = graph.themeMap[prop]
    console.log('removing theme', prop, themeMapEntries)
    const index = themeMapEntries.findIndex(entry => entry.useThemeId === id)
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