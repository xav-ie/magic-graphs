import type { Ref } from 'vue'
import type { GraphOptions } from '@graph/types'
import { useUserPreferredTheme } from '@graph/themes/useUserPreferredTheme'
import { useGraphHelpers } from '@graph/helpers/useGraphHelpers'
import { useBaseGraph } from '@graph/base'
import { useMarquee } from '@graph/plugins/marquee'
import { useNodeDrag } from '@graph/plugins/drag'
import { useNodeAnchors } from '@graph/plugins/anchors'
import { useUserEditableGraph } from '@graph/plugins/editable'
import { useAnnotations } from '@graph/plugins/annotations'
import { useFocus } from '@graph/plugins/focus'
import { useHistory } from '@graph/plugins/history'
import { usePersistent } from '@graph/plugins/persistent'
import { clone } from '@utils/clone'

/**
 * a package full of tools for creating and managing graphs
 *
 * @param canvas - the HTML canvas element to render the graph on
 * @param options - the options for the graph including themes and settings
 * @returns a graph instance with APIs for managing the graph
 */
export const useGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<GraphOptions> = {},
) => {
  const baseGraph = useBaseGraph(canvas, options)

  const focusControls = useFocus(baseGraph)
  const historyControls = useHistory(baseGraph)
  const marqueeControls = useMarquee({ ...baseGraph, ...focusControls })
  const nodeAnchorControls = useNodeAnchors({ ...baseGraph, ...focusControls })
  const nodeDragControls = useNodeDrag({ ...baseGraph, ...nodeAnchorControls })
  const annotationControls = useAnnotations(baseGraph)
  const persistentControls = usePersistent(baseGraph)

  useUserEditableGraph({ ...baseGraph, ...historyControls, ...focusControls })

  const overrideThemes = clone(options?.theme ?? {})
  useUserPreferredTheme(baseGraph, overrideThemes)

  return {
    ...baseGraph,
    ...focusControls,
    ...historyControls,
    ...marqueeControls,
    ...nodeDragControls,
    ...nodeAnchorControls,
    ...annotationControls,
    ...persistentControls,
    helpers: useGraphHelpers(baseGraph),
  }
}