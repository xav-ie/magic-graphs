import type { GraphThemeName } from "@graph/themes";
import colors, { type Color } from "@utils/colors";

type WellTheme = {
  color: Color;
  secondaryColor: Color;
  textColor: Color;
}

export const GWellTheme: Record<GraphThemeName, WellTheme> = {
  light: {
    color: colors.GRAY_300,
    secondaryColor: colors.GRAY_200,
    textColor: colors.GRAY_700
  },
  dark: {
    color: colors.GRAY_800,
    secondaryColor: colors.GRAY_700,
    textColor: colors.GRAY_100
  },
  girl: {
    color: colors.PINK_100,
    secondaryColor: colors.PINK_200,
    textColor: colors.PINK_800,
  },
};