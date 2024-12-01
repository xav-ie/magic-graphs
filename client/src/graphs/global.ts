import { shallowRef, ref } from "vue";
import { useGraph } from "./useGraph";
import type { Graph } from "./types";
import { defineStore } from "pinia";

export const graph = shallowRef({} as Graph);

export const useGraphStore = defineStore('graph', () => {
  const graph = ref(useGraph(shallowRef()))

  return {
    graph,
  }
})
