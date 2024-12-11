import { shallowRef } from "vue";
import type { GEdge, GNode, Graph } from "./types";

export const graph = shallowRef({} as Graph);

/**
 * when switching between products, if this is set, the graph will be loaded with this state
 */
export const queuedGraphStateLoadout = shallowRef<{ nodes: GNode[], edges: GEdge[] }>()