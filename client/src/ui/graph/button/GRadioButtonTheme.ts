import type { GraphThemeName } from "@graph/themes";
import colors, { type Color } from "@utils/colors";

type RadioButtonTheme = {
  outlineColor: Color;
  color: Color;
}

export const GRadioButtonTheme: Record<GraphThemeName, RadioButtonTheme> = {
  light: { outlineColor: colors.GRAY_800, color: colors.GRAY_200 },
  dark: { outlineColor: colors.GRAY_200, color: colors.GRAY_700 },
  girl: { outlineColor: colors.PINK_600, color: colors.PINK_600 },
};