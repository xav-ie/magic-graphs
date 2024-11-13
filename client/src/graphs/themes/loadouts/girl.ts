import colors from '@colors'
import type { GraphTheme } from '@graph/themes'
import { NON_COLOR_THEMES } from './universal'

export const GIRL_THEME: GraphTheme = {
  primaryColor: colors.PINK_500,
  secondaryColor: colors.PINK_700,
  tertiaryColor: colors.PINK_900,
  primaryTextColor: colors.WHITE,
  secondaryTextColor: colors.WHITE,
  tertiaryTextColor: colors.WHITE,

  nodeColor: colors.PINK_100,
  nodeBorderColor: colors.PINK_400,
  nodeFocusBorderColor: colors.PURPLE_600,
  nodeFocusColor: colors.PURPLE_200,
  nodeTextColor: colors.PINK_600,
  nodeFocusTextColor: colors.PURPLE_900,

  edgeColor: colors.PINK_600,
  edgeTextColor: colors.PINK_600,
  edgeFocusColor: colors.PURPLE_600,
  edgeFocusTextColor: colors.PURPLE_600,

  graphBgColor: colors.PINK_200,
  graphBgPatternColor: colors.PINK_900 + '15',

  nodeAnchorColor: colors.PINK_500,
  nodeAnchorColorWhenParentFocused: colors.PURPLE_700,
  linkPreviewColor: colors.PINK_900,

  marqueeSelectionBoxColor: colors.PINK_300 + '15',
  marqueeSelectionBoxBorderColor: colors.PINK_500,
  marqueeEncapsulatedNodeBoxBorderColor: colors.PINK_700,
  marqueeEncapsulatedNodeBoxColor: colors.PINK_700 + '05',

  ...NON_COLOR_THEMES,
}