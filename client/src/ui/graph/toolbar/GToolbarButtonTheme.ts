import type { GraphThemeName } from "@graph/themes";
import colors, { type Color } from "@utils/colors";

type ToolbarButtonTheme = {
  color: Color;
  activeColor: Color;

}

export const GToolbarButtonTheme: Record<GraphThemeName, ToolbarButtonTheme> = {
  light: { color: colors.GRAY_300, activeColor: colors.GRAY_200 },
  dark: { color: colors.GRAY_800, activeColor: colors.GRAY_900 },
  girl: { color: colors.PINK_600, activeColor: colors.PINK_800 },
};