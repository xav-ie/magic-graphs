<script setup lang="ts">
import { ref } from "vue";
import { useGraph } from "@graph/useGraph";
import Graph from "@graph/Graph.vue";
import { edgeLabelIsPositiveNumber } from "./useSetupGraph";
import Button from "@ui/Button.vue";
import { useColorizeGraph } from "./useColorizeGraph";
import CollabControls from "@playground/graph/CollabControls.vue";
import Progressbar from "@ui/sim/Progressbar.vue";
import colors from "@utils/colors";
import SimulationPlaybackControls from "@ui/sim/SimulationPlaybackControls.vue";
import { useMSTSimulation } from "./useSimulation";
import type { Algorithm } from "./useSimulation";

const graphEl = ref<HTMLCanvasElement>();
const graph = useGraph(graphEl, {
  settings: {
    persistentStorageKey: "min-spanning-tree",
    userEditableAddedEdgeType: "undirected",
    edgeInputToLabel: edgeLabelIsPositiveNumber,
  },
});

const currentAlgorithm = ref<Algorithm>("none");

const simControls = useMSTSimulation(graph, currentAlgorithm);

const handleButtonClick = (newAlgorithm: Algorithm) => {
  currentAlgorithm.value = newAlgorithm;
  if (newAlgorithm === "none") useColorizeGraph(graph, graph.edges.value);
  else useColorizeGraph(graph, simControls.trace.value);
};

setTimeout(() => handleButtonClick("none"), 1); // I dont know why this is needed
</script>

<template>
  <div class="w-full h-full relative">
    <Graph @graph-ref="(el) => (graphEl = el)" :graph="graph" />
  </div>

  <div class="absolute top-0 p-3 flex gap-3">
    <div v-if="!simControls.isActive.value" class="gap-3 flex">
      <Button
        @click="handleButtonClick('kruskal')"
        :color="currentAlgorithm === 'kruskal' ? colors.GREEN_400 : undefined"
        >Kruskal</Button
      >
      <Button
        @click="handleButtonClick('prim')"
        :color="currentAlgorithm === 'prim' ? colors.GREEN_400 : undefined"
        >Prim</Button
      >
      <Button
        @click="handleButtonClick('none')"
        :color="currentAlgorithm === 'none' ? colors.GREEN_400 : undefined"
        >None</Button
      >
    </div>
    <div v-if="currentAlgorithm !== 'none'">
      <Button v-if="!simControls.isActive.value" @click="simControls.start">
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
  </div>

  <div
    v-if="simControls.isActive.value"
    class="absolute bottom-8 w-full flex flex-col justify-center items-center p-3"
  >
    <Progressbar
      class="w-[300px] border-gray-200 border-2 mb-8"
      :theme="{
        progressColor: colors.GRAY_200,
        backgroundColor: colors.SLATE_500,
        borderRadius: 20,
      }"
      :start-progress="0"
      :current-progress="simControls.step.value"
      :end-progress="simControls.trace.value.length"
    />
    <SimulationPlaybackControls :controls="simControls" />
  </div>

  <div
    v-if="!simControls.isActive.value"
    class="absolute right-0 p-3 h-14 flex gap-3 bottom-0"
  >
    <CollabControls :graph="graph" />
  </div>
</template>
