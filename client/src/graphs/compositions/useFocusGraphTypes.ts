import type {
  GEdge,
  GNode,
  SchemaItem
} from "@graph/types"

export type Id = SchemaItem['id']
export type MaybeId = Id | undefined

export type FocusedItem = {
  type: 'node',
  item: GNode,
} | {
  type: 'edge',
  item: GEdge,
}

export type ValidFocusableTypes = SchemaItem['graphType'] & FocusedItem['type']

export const FOCUSABLE_GRAPH_TYPES: ValidFocusableTypes[] = ['node', 'edge']
export const FOCUS_THEME_ID = 'use-focus-graph'