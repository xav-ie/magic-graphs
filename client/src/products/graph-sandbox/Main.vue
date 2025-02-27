<script setup lang="ts">
  import { computed, ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import Graph from "@graph/Graph.vue";
  import { SANDBOX_GRAPH_SETTINGS } from "./settings";
  import IslandToolbar from "./IslandToolbar.vue";
  import IslandMarkup from "./IslandMarkup.vue";
  import SimulationDropdown from "./SimulationDropdown.vue";
  import SimulationPlaybackControls from "@ui/sim/SimulationPlaybackControls.vue";
  import type { SimulationDeclaration } from "src/types";

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, {
    settings: SANDBOX_GRAPH_SETTINGS,
  });

  const activeSimulation = ref<SimulationDeclaration>();
  const simControls = computed(() => activeSimulation.value?.controls);
</script>

<template>
  <Graph
    @graph-ref="(el) => (graphEl = el)"
    :graph="graph"
  />

  <div
    v-if="!simControls"
    class="absolute top-6 w-full flex flex-col justify-center items-center gap-2"
  >
    <IslandToolbar :graph="graph" />
  </div>

  <div
    v-if="!simControls"
    class="absolute top-0 w-0 h-full flex items-center"
  >
    <div class="ml-4">
      <IslandMarkup :graph="graph" />
    </div>
  </div>

  <div class="absolute top-6 right-6">
    <SimulationDropdown
      v-model="activeSimulation"
      :graph="graph"
    />
  </div>

  <div
    v-if="simControls"
    class="absolute bottom-8 w-full flex justify-center items-center p-3"
  >
    <SimulationPlaybackControls :controls="simControls" />
  </div>
</template>
