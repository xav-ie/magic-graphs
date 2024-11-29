import { shallowRef } from "vue";
import { useGraph } from "./useGraph";
import type { Graph } from "./types";

/**
 * the global active graph instance set by product boot (@utils/productBoot)
 */
export const globalGraph: { value: Graph } = { value: {} as Graph };