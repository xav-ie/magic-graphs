<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import Graph from "@graph/Graph.vue";
  import { useMSTSimulation, MST_ALGORITHMS } from "./useSimulation";
  import type { MSTAlgorithm } from "./useSimulation";
  import SimulationControls from "./SimulationControls.vue";
  import { MST_GRAPH_SETTINGS } from "./settings";
  import TopRightToolbar from "./TopRightToolbar.vue";
  import { useGraphProductBoot } from "@utils/productBoot";
  import ProductDropdown from "@ui/product/dropdown/ProductDropdown.vue";

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, {
    settings: MST_GRAPH_SETTINGS,
  });

  const currentAlgorithm = ref<MSTAlgorithm>(MST_ALGORITHMS[0]);

  const simControls = useMSTSimulation(graph, currentAlgorithm);

  const startSimulation = (algorithm: MSTAlgorithm) => {
    currentAlgorithm.value = algorithm;
    simControls.start();
  };

  useGraphProductBoot(graph);
</script>

<template>
  <div class="w-full h-full relative">
    <Graph
      @graph-ref="(el) => (graphEl = el)"
      :graph="graph"
    />
  </div>

  <div class="absolute top-6 left-6">
    <ProductDropdown />
  </div>

  <div class="absolute top-0 right-0 p-3 flex gap-3">
    <TopRightToolbar
      :graph="graph"
      :simControls="simControls"
      :startSimulation="startSimulation"
    />
  </div>

  <div
    v-if="simControls.isActive.value"
    class="absolute bottom-8 w-full flex flex-col justify-center items-center p-3"
  >
    <SimulationControls :controls="simControls" />
  </div>
</template>
