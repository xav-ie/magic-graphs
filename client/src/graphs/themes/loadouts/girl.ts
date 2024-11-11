import colors from '@colors'
import type { GraphTheme } from '@graph/themes'
import { NON_COLOR_THEMES } from './universal'

export const GIRL_THEME: GraphTheme = {
  nodeColor: colors.PINK_100,
  nodeBorderColor: colors.PINK_400,
  nodeFocusBorderColor: colors.PURPLE_600,
  nodeFocusColor: colors.PURPLE_200,
  nodeTextColor: colors.PINK_900,
  nodeFocusTextColor: colors.WHITE,

  edgeColor: colors.PINK_800,
  edgeTextColor: colors.PINK_900,
  edgeFocusColor: colors.PURPLE_600,
  edgeFocusTextColor: colors.PINK_900,

  graphBgColor: colors.PINK_200,
  graphBgPatternColor: colors.PINK_900 + '15',

  nodeAnchorColor: colors.PINK_500,
  nodeAnchorColorWhenParentFocused: colors.PURPLE_700,
  linkPreviewColor: colors.PINK_900,

  marqueeSelectionBoxColor: colors.PINK_300 + '15',
  marqueeSelectionBoxBorderColor: colors.PINK_500,

  ...NON_COLOR_THEMES,
}