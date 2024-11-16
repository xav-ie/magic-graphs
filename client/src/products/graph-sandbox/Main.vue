<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import Graph from "@graph/Graph.vue";
  import { SANDBOX_GRAPH_SETTINGS } from "./settings";
  import IslandToolbar from "./IslandToolbar.vue";
  import MarkupMenu from "./MarkupMenu.vue";

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

  <div
    class="absolute top-6 w-full flex flex-col justify-center items-center gap-2"
  >
    <IslandToolbar :graph="graph" />
  </div>

  <div class="absolute top-0 w-0 h-full flex items-center">
    <div class="ml-4">
      <MarkupMenu :graph="graph" />
    </div>
  </div>
</template>
