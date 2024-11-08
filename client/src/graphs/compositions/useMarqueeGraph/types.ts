import type { SchemaItem } from "@graph/types";
import colors from "@utils/colors";

const SELECTABLE_GRAPH_TYPES: SchemaItem['graphType'][] = ['node', 'edge']
const SAMPLING_RATE = 5;
const SELECTION_BORDER_COLOR = colors.WHITE
const SELECTION_BG_COLOR = colors.WHITE + '10'
const THEME_ID = 'use-marquee-graph'

export const MARQUEE_CONSTANTS = {
  SELECTABLE_GRAPH_TYPES,
  SAMPLING_RATE,
  SELECTION_BORDER_COLOR,
  SELECTION_BG_COLOR,
  THEME_ID,
}
