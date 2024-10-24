import type { Graph } from "../useGraph";
import type { UnwrapRef } from "vue";

type UseGraphTheme = UnwrapRef<Graph['theme']>
type ThemeKey = keyof UseGraphTheme

type Theme<T extends ThemeKey> = {
  themeProp: T,
  value: UseGraphTheme[T],
}

export const useTheme = (graph: Graph, id: string) => {

  const setTheme = <T extends keyof UseGraphTheme>(theme: Theme<T>) => {
    removeTheme(theme.themeProp)
    // internalThemes.push(theme)
  }

  const removeTheme = (themeProp: ThemeKey) => {
    // internalThemes.filter(theme => theme.themeProp !== themeProp)
  }

  return {
    setTheme,
    removeTheme
  }
}