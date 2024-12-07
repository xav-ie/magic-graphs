import { graph } from "@graph/global";
import colors from "@utils/colors";
import type { GraphThemeName } from ".";
import { computed } from "vue";

type GraphColors = {
  primary: string
  secondary: string
  tertiary: string
  text: string
};

export const ThemeToGraphColors: Record<GraphThemeName, GraphColors> = {
  light: {
    primary: colors.GRAY_300,
    secondary: colors.GRAY_200,
    tertiary: colors.GRAY_400,
    text: colors.GRAY_900,
  },
  dark: {
    primary: colors.GRAY_800,
    secondary: colors.GRAY_700,
    tertiary: colors.GRAY_900,
    text: colors.GRAY_100,
  },
  girl: {
    primary: colors.PINK_600,
    secondary: colors.PINK_500,
    tertiary: colors.PINK_700,
    text: colors.PINK_900,
  }
}

export const useGraphColors = () => computed(() => {
  const theme = graph.value.themeName.value;
  return ThemeToGraphColors[theme];
});
