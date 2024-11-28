<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import { useSimulationRunner } from "./useSimulationRunner";
  import CostDisplay from "./CostDisplay.vue";
  import { DIJKSTRAS_GRAPH_SETTINGS } from "./settings";
  import { useGraphProductBoot } from "@utils/productBoot";
  import GraphProduct from "@ui/product/GraphProduct.vue";

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, {
    settings: DIJKSTRAS_GRAPH_SETTINGS,
  });

  const simRunner = useSimulationRunner(graph);
  useGraphProductBoot(graph);
</script>

<template>
  <GraphProduct
    @graph-ref="(el) => (graphEl = el)"
    :graph="graph"
    :simulation-runner="simRunner"
  >
    <template #top-center></template>

    <template #center-left></template>

    <template #center-right-sim>
      <div
        v-if="simRunner.simControls.isActive.value"
        class="bg-gray-800 bg-opacity-80 p-2 rounded-xl overflow-auto"
      >
        <CostDisplay :graph="graph" />
      </div>
    </template>
  </GraphProduct>
</template>
