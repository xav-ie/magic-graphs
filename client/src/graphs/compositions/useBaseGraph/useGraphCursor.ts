import { computed, ref, watch } from "vue";
import type { Ref } from "vue";
import type { SchemaItem } from "@graph/types";
import type { GraphAtMousePosition, GraphMouseEvent } from "./types";
import type { Subscriber } from "@graph/events";

/**
 * cursor types supported by the browser
 */
export type Cursor =
  | "auto"
  | "default"
  | "none"
  | "context-menu"
  | "help"
  | "pointer"
  | "progress"
  | "wait"
  | "cell"
  | "crosshair"
  | "text"
  | "vertical-text"
  | "alias"
  | "copy"
  | "move"
  | "no-drop"
  | "not-allowed"
  | "grab"
  | "grabbing"
  | "e-resize"
  | "n-resize"
  | "ne-resize"
  | "nw-resize"
  | "s-resize"
  | "se-resize"
  | "sw-resize"
  | "w-resize"
  | "ew-resize"
  | "ns-resize"
  | "nesw-resize"
  | "nwse-resize"
  | "col-resize"
  | "row-resize"
  | "all-scroll"
  | "zoom-in"
  | "zoom-out"

/**
 * manages the cursor type when hovering over the graph
 *
 * @param subscribe - the event subscriber
 * @param canvas - the canvas element
 * @param graphAtMousePosition - the graph items at the mouse position
 * @returns the cursor manager
 */
export const useGraphCursor = ({
  subscribe,
  canvas,
  graphAtMousePosition,
}: {
  subscribe: Subscriber;
  canvas: Ref<HTMLCanvasElement | null | undefined>;
  graphAtMousePosition: Ref<GraphAtMousePosition>;
}) => {
  const isMouseDown = ref(false)
  const graphCursorDisabled = ref(false)

  const graphToCursorMap = ref<Partial<Record<SchemaItem['graphType'], Cursor>>>({
    'node': 'grab',
    'edge': 'pointer',
    'node-anchor': 'grab',
    'encapsulated-node-box': 'move',
  })

  const isItemSelectable = ref<(item: SchemaItem) => boolean>()
  const inSelectMode = computed(() => !!isItemSelectable.value)

  const activateCursorSelectMode = (predicate: (item: SchemaItem) => boolean) => {
    isItemSelectable.value = predicate
  }

  const deactivateCursorSelectMode = () => {
    isItemSelectable.value = undefined
  }

  const getCursorType = (item: SchemaItem | undefined) => {
    if (graphCursorDisabled.value || !item) return 'default'

    if (inSelectMode.value) {
      const isSelectable = isItemSelectable.value?.(item) ?? false
      return isSelectable ? 'pointer' : 'default'
    }

    const cursor = graphToCursorMap.value[item.graphType] ?? 'default'
    if (cursor === 'grab' && isMouseDown.value) return 'grabbing'

    return cursor
  }

  const changeCursorType = ({ items }: Pick<GraphMouseEvent, 'items'>) => {
    if (!canvas.value) return
    const topItem = items.at(-1)
    canvas.value.style.cursor = getCursorType(topItem)
  }

  subscribe('onMouseDown', (ev) => {
    isMouseDown.value = true
    changeCursorType(ev)
  })

  subscribe('onMouseUp', (ev) => {
    isMouseDown.value = false
    changeCursorType(ev)
  })

  subscribe('onMouseMove', changeCursorType)

  watch(graphToCursorMap, () => {
    changeCursorType({
      items: graphAtMousePosition.value.items
    })
  }, { deep: true })

  return {
    /**
     * maps graph schema item types to browser cursor.
     * changing this mapping will change the cursor type when hovering over the graph.
     */
    graphToCursorMap,
    /**
     * activates a cursor select mode, where only the specified graph types will receive a pointer cursor.
     * everything else will receive the default cursor as long as this mode is active.
     * @param selectableTypes - the graph types that will be selectable.
     */
    activateCursorSelectMode,
    /**
     * deactivates the cursor select mode.
     */
    deactivateCursorSelectMode,
    /**
     * when the graph cursor is disabled, the cursor will always be the default cursor.
     */
    graphCursorDisabled,
  }
};