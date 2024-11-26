<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import Graph from "@graph/Graph.vue";
  import Button from "@ui/Button.vue";
  import SimulationPlaybackControls from "@ui/sim/SimulationPlaybackControls.vue";
  import colors from "@colors";
  import { useSimulationRunner } from "./useSimulationRunner";
  import CostDisplay from "./CostDisplay.vue";
  import { DIJKSTRAS_GRAPH_SETTINGS } from "./settings";
  import { useGraphProductBoot } from "@utils/productBoot";

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
  <div class="w-full h-full relative">
    <Graph
      @graph-ref="(el) => (graphEl = el)"
      :graph="graph"
    />
  </div>

  <div class="absolute top-0 p-3 flex gap-3">
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
  </div>

  <div
    v-if="simControls.isActive.value && graph.nodes.value.length > 0"
    class="absolute p-3 my-3 top-0 right-0 overflow-auto bg-gray-800 bg-opacity-80 rounded-l-xl max-h-[calc(100%-1.5rem)] overflow-auto"
  >
    <CostDisplay :graph="graph" />
  </div>

  <div
    v-if="simControls.isActive.value"
    class="absolute bottom-8 w-full flex justify-center items-center p-3"
  >
    <SimulationPlaybackControls :controls="simControls" />
  </div>
</template>
