import type { GNode } from "@graph/types"
import type { BaseGraph } from "@graph/base"
import type { GraphMouseEvent } from '@graph/base/types'
import type { NodeAnchor } from "@graph/plugins/anchors/types"
import { useShortcutPressed } from './useShortcutPressed'
import type { GraphHistoryControls } from "../history"
import type { GraphFocusControls } from "../focus"

/**
 * the user editable graph implements handlers for node creation,
 * edge creation and deletion driven by user input.
 */
export const useUserEditableGraph = (
  graph: BaseGraph & GraphHistoryControls & GraphFocusControls,
) => {
  const handleDeletion = () => {
    graph.bulkRemoveNode([...graph.focusedItemIds.value])
    graph.bulkRemoveEdge([...graph.focusedItemIds.value])
  }

  const KEY_BINDINGS = {
    Mac: {
      ['Meta+Z']: () => graph.undo(),
      ['Shift+Meta+Z']: () => graph.redo(),
      ['Meta+Shift+Z']: () => graph.redo(),
      ['Backspace']: handleDeletion,
      ['Meta+A']: graph.focusAll,
      ['Escape']: graph.resetFocus,
    },
    Windows: {
      ['Control+Z']: () => graph.undo(),
      ['Shift+Control+Z']: () => graph.redo(),
      ['Control+Shift+Z']: () => graph.redo(),
      ['Backspace']: handleDeletion,
      ['Control+A']: graph.focusAll,
      ['Escape']: graph.resetFocus,
    },
  } as const

  const USER_PLATFORM = window.navigator.userAgent.includes('Mac') ? 'Mac' : 'Windows'

  const { isPressed } = useShortcutPressed()

  const handleKeyboardEvents = (ev: KeyboardEvent) => {
    if (graph.canvasFocused.value === false) return
    const userKeyBindings = KEY_BINDINGS[USER_PLATFORM]
    for (const key in userKeyBindings) {
      if (isPressed(key)) {
        userKeyBindings[key as keyof typeof userKeyBindings]()
        ev.preventDefault()
      }
    }
  }
}