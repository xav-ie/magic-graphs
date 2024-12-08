import type { Ref } from 'vue'
import { usePreferredTheme } from '@graph/themes/usePreferredTheme'
import { useGraphHelpers } from '@graph/helpers/useGraphHelpers'
import { useBaseGraph } from '@graph/base'
import { useMarquee } from '@graph/plugins/marquee'
import { useNodeDrag } from '@graph/plugins/drag'
import { useNodeAnchors } from '@graph/plugins/anchors'
import { useShortcuts } from '@graph/plugins/shortcut'
import { useAnnotations } from '@graph/plugins/annotations'
import { useFocus } from '@graph/plugins/focus'
import { useHistory } from '@graph/plugins/history'
import { usePersistent } from '@graph/plugins/persistent'
import type { GraphSettings } from './settings'
import { useInteractive } from './plugins/interactive'
import { useAdjacencyList } from './useAdjacencyList'
import { useCharacteristics } from './plugins/characteristics'
import { useTransitionMatrix } from './useTransitionMatrix'

/**
 * a package full of tools for creating and managing graphs
 *
 * @param canvas - the HTML canvas element to render the graph on
 * @param settings - settings for the graph
 * @returns a graph instance with APIs for managing the graph
 */
export const useGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  settings: Partial<GraphSettings> = {},
) => {
  const baseGraph = useBaseGraph(canvas, settings)

  const focusControls = useFocus(baseGraph)
  const historyControls = useHistory(baseGraph)
  const marqueeControls = useMarquee({ ...baseGraph, ...focusControls })
  const nodeAnchorControls = useNodeAnchors({ ...baseGraph, ...focusControls })
  const nodeDragControls = useNodeDrag({ ...baseGraph, ...nodeAnchorControls })
  const annotationControls = useAnnotations(baseGraph)
  const persistentControls = usePersistent(baseGraph)
  const preferredThemeControls = usePreferredTheme(baseGraph)
  const shortcutActions = useShortcuts({
    ...baseGraph,
    ...historyControls,
    ...focusControls,
    ...annotationControls
  })

  const adjacencyLists = useAdjacencyList(baseGraph)
  const transitionMatrix = useTransitionMatrix(baseGraph)

  const characteristics = useCharacteristics({ ...baseGraph, adjacencyLists })

  useInteractive(baseGraph)

  return {
    ...baseGraph,
    ...focusControls,
    ...historyControls,
    ...marqueeControls,
    ...nodeDragControls,
    ...nodeAnchorControls,
    ...annotationControls,
    ...persistentControls,
    ...preferredThemeControls,
    shortcutActions,
    adjacencyLists,
    transitionMatrix,
    characteristics,
    helpers: useGraphHelpers(baseGraph),
  }
}