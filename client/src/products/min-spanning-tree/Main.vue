<script setup lang="ts">
import { ref } from "vue";
import { useGraph } from "@graph/useGraph";
import Graph from "@graph/Graph.vue";
import { edgeLabelIsPositiveNumber } from "./useSetupGraph";
import Button from "@ui/Button.vue";
import { useColorizeGraph } from "./useColorizeGraph";
import CollabControls from "@playground/graph/CollabControls.vue";
import Progressbar from "./progressbar/Progressbar.vue";
import colors from "@utils/colors";
import SimulationPlaybackControls from "@ui/sim/SimulationPlaybackControls.vue";
import { useMSTSimulation } from "./useSimulation";

const graphEl = ref<HTMLCanvasElement>();
const graph = useGraph(graphEl, {
  settings: {
    persistentStorageKey: "min-spanning-tree",
    userEditableAddedEdgeType: "undirected",
    edgeInputToLabel: edgeLabelIsPositiveNumber,
  },
});


type Algorithm = "kruskal" | "prim" | 'none';

const currentAlgorithm = ref<Algorithm>('none');

const simControls = useMSTSimulation(graph, currentAlgorithm);

const handleButtonClick = (newAlgorithm: Algorithm) => {
  currentAlgorithm.value = newAlgorithm;
  if (newAlgorithm === 'none') useColorizeGraph(graph, graph.edges.value);
  else useColorizeGraph(graph, simControls.trace.value);
}
</script>

<template>
  <div class="w-full h-full relative">
    <Graph
      @graph-ref="(el) => (graphEl = el)"
      :graph="graph"
    />
  </div>

  <div class="absolute top-0 p-3 flex gap-3">

    <div v-if="!simControls.isActive.value" class="gap-3 flex">
      <Button @click="handleButtonClick('kruskal')">Kruskal</Button>
      <Button @click="handleButtonClick('prim')">Prim</Button>
      <Button @click="handleButtonClick('none')">None</Button>
    </div>
    <div v-if="currentAlgorithm !== 'none'">
      <Button
        v-if="!simControls.isActive.value"
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
  </div>

  <div
    v-if="simControls.isActive.value"
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

  <div
    v-if="!simControls.isActive.value"
    class="absolute right-0 p-3 h-14 flex gap-3 bottom-0"
  >
    <CollabControls :graph="graph" />
  </div>
</template>
