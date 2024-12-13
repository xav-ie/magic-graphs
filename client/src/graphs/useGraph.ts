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
import { useAnimation } from './plugins/animation'
import type { GraphSettings } from './settings'
import { useInteractive } from './plugins/interactive'
import { useAdjacencyList } from './useAdjacencyList'
import { useCharacteristics } from './plugins/characteristics'
import { useTransitionMatrix } from './useTransitionMatrix'

/**
 * a package brimming with tools for creating and managing graphs bringing
 * light and joy to the world
 *
 * @param canvas the HTML canvas element to render the graph onto
 * @param settings default settings for the graph
 * @returns a graph instance with APIs for managing the graph
 */
export const useGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  settings: Partial<GraphSettings> = {},
) => {
  const base = useBaseGraph(canvas, settings)

  const focus = useFocus(base)
  const history = useHistory(base)
  const marquee = useMarquee({ ...base, ...focus })
  const nodeAnchor = useNodeAnchors({ ...base, ...focus })
  const nodeDrag = useNodeDrag({ ...base, ...nodeAnchor })
  const annotation = useAnnotations(base)
  const persistent = usePersistent(base)
  const preferredTheme = usePreferredTheme(base)
  const shortcutActions = useShortcuts({
    ...base,
    ...history,
    ...focus,
    ...annotation
  })

  const adjacencyList = useAdjacencyList(base)
  const transitionMatrix = useTransitionMatrix(base)

  const characteristics = useCharacteristics({ ...base, adjacencyList })
  const animate = useAnimation({
    ...base,
    ...history,
    ...focus,
    ...marquee,
    ...persistent
  })

  useInteractive(base)

  return {
    ...base,

    /**
     * plugin controllers
     */
    focus,
    history,
    marquee,
    nodeDrag,
    nodeAnchor,
    annotation,
    persistent,
    animate,

    /**
     * theme and style
     */
    ...preferredTheme,

    /**
     * reactive data structures and algorithms
     */
    adjacencyList,
    transitionMatrix,
    characteristics,

    /**
     * helper functions
    */
    shortcutActions,
    helpers: useGraphHelpers(base),
  }
}