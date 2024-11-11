<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import Graph from "@graph/Graph.vue";
  import { useSimulator } from "./useSimulator";
  import SimulatorControls from "./SimulatorControls.vue";
  import Button from "@ui/Button.vue";
  import colors from "@colors";
  import CostDisplay from "./CostDisplay.vue";
  import CollabControls from "@playground/graph/CollabControls.vue";

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, {
    settings: {
      persistentStorageKey: "dijkstras",
    },
  });

  const getNewLabel = () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const labels = graph.nodes.value.map((node) => node.label);
    let label = 0;
    while (labels.includes(alphabet[label])) label++;
    return alphabet[label];
  };

  graph.subscribe("onNodeAdded", (node) => {
    node.label = getNewLabel();
  });

  const simControls = useSimulator(graph);
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
      v-if="!simControls.active.value"
      @click="simControls.start"
    >
      Start Simulation
    </Button>

    <Button
      v-else
      @click="simControls.stop"
      :color="colors.RED_600"
      :text-color="colors.WHITE"
    >
      Stop Simulation
    </Button>
  </div>

  <div
    v-if="simControls.active.value"
    class="absolute p-3 my-3 top-0 right-0 overflow-auto bg-gray-800 bg-opacity-80 rounded-l-xl h-[calc(100%-1.5rem)] overflow-auto"
  >
    <CostDisplay :graph="graph" />
  </div>

  <div class="absolute bottom-8 w-full flex justify-center items-center p-3">
    <SimulatorControls :controls="simControls" />
  </div>

  <div
    v-if="!simControls.active.value"
    class="absolute right-0 p-3 h-14 flex gap-3 bottom-0"
  >
    <CollabControls :graph="graph" />
  </div>
</template>
