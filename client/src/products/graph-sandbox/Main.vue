<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import Graph from "@graph/Graph.vue";
  import { SANDBOX_GRAPH_SETTINGS } from "./settings";

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, {
    settings: SANDBOX_GRAPH_SETTINGS,
  });
</script>

<template>
  <Graph
    @graph-ref="(el) => (graphEl = el)"
    :graph="graph"
  />

  <div class="absolute top-6 w-full flex justify-center">
    <div class="flex items-center gap-3 bg-gray-800 py-1 px-2 rounded-lg">
      <div>
        <v-icon
          @click="graph.undo()"
          class="text-white bg-gray-800 hover:bg-gray-900 p-5 rounded-md cursor-pointer"
          :style="{
            opacity: graph.canUndo.value ? 1 : 0.5
          }"
        >
          mdi-undo
        </v-icon>
      </div>
      <div>
        <v-icon
          @click="graph.redo()"
          class="text-white bg-gray-800 hover:bg-gray-900 p-5 rounded-md cursor-pointer"
          :style="{
            opacity: graph.canRedo.value ? 1 : 0.5
          }"
        >
          mdi-redo
        </v-icon>
      </div>
    </div>
  </div>
</template>
