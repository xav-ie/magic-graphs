<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import Button from "@ui/Button.vue";
  import colors from "@colors";
  import { useSimulationRunner } from "./useSimulationRunner";
  import CostDisplay from "./CostDisplay.vue";
  import { DIJKSTRAS_GRAPH_SETTINGS } from "./settings";
  import { useGraphProductBoot } from "@utils/productBoot";
  import GraphProduct from "@ui/product/GraphProduct.vue";

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, {
    settings: DIJKSTRAS_GRAPH_SETTINGS,
  });

  const {
    start: startSim,
    stop: stopSim,
    running: simRunning,
    simControls,
  } = useSimulationRunner(graph);

  useGraphProductBoot(graph);
</script>

<template>
  <GraphProduct
    @graph-ref="(el) => (graphEl = el)"
    :graph="graph"
    :simulation="simControls"
    :in-simulation-mode="simRunning"
  >
    <template #top-center></template>

    <template #center-left></template>

    <template #top-right>
      <Button
        v-if="!simRunning"
        @click="startSim"
      >
        Start Simulation
      </Button>

      <Button
        v-else
        @click="stopSim"
        :color="colors.RED_600"
        :text-color="colors.WHITE"
      >
        Stop Simulation
      </Button>
    </template>
  </GraphProduct>

  <!-- <div
    v-show="simControls.isActive.value && graph.nodes.value.length > 0"
    class="absolute p-3 my-3 top-12 right-0 overflow-auto bg-gray-800 bg-opacity-80 rounded-l-xl max-h-[calc(100%-1.5rem)] overflow-auto"
  >
    <CostDisplay :graph="graph" />
  </div> -->
</template>
