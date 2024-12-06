import type { GraphThemeName } from "@graph/themes";
import colors, { type Color } from "@utils/colors";

export const GToolbarDividerTheme: Record<GraphThemeName, Color> = {
  light: colors.BLACK + "20",
  dark: colors.GRAY_100 + "20",
  girl: colors.PINK_100 + "20",
};