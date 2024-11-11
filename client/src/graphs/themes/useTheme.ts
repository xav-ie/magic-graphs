import { onUnmounted } from "vue";
import type { Graph } from "@graph/types";
import type { GraphThemeKey } from "@graph/themes";
import type { ThemeMapEntry } from "@graph/themes/types";

type ThemeableGraph = Pick<Graph, 'themeMap' | 'repaint'>

/**
 * set and remove themes for a graph instance
 *
 * @param graph - the graph instance you want to set themes for
 * @param themeId - identifier for this useTheme instance
 * @returns functions to set and remove themes
 */
export const useTheme = <G extends ThemeableGraph>(graph: G, themeId: string) => {

  /**
   * set a theme value for a specific theme property in your graph.
   *
   * @param prop - the theme property you want to set
   * @param value - the value you want to set for the theme property
   */
  const setTheme = <T extends GraphThemeKey>(prop: T, value: ThemeMapEntry<T>['value']) => {
    removeTheme(prop, false)
    const themeMapEntries = graph.themeMap[prop]
    themeMapEntries.push({
      value,
      useThemeId: themeId
    })
    graph.repaint(`use-theme/set-theme/from:"${themeId}"/prop:"${prop}"`)()
  }


  /**
   * removes a theme value for a specific theme property attached to this useTheme instance
   *
   * @param prop - the theme property you want to remove
   * @param repaint - whether to repaint the graph after removing the theme (default: true)
   */
  const removeTheme = (prop: GraphThemeKey, repaint = true) => {
    const themeMapEntries = graph.themeMap[prop]
    const index = themeMapEntries.findIndex(entry => entry.useThemeId === themeId)
    if (index !== -1) {
      themeMapEntries.splice(index, 1)
      if (repaint) graph.repaint(`use-theme/remove-theme/from:"${themeId}"/prop:"${prop}"`)()
    }
  }

  /**
   * removes all themes attached to this useTheme instance
   */
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