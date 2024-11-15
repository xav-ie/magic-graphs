<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import Graph from "@graph/Graph.vue";
  import Button from "@ui/Button.vue";
  import CollabControls from "@playground/graph/CollabControls.vue";
  import Progressbar from "@ui/sim/Progressbar.vue";
  import colors from "@utils/colors";
  import SimulationPlaybackControls from "@ui/sim/SimulationPlaybackControls.vue";
  import { useMSTSimulation, MST_ALGORITHMS } from "./useSimulation";
  import type { MSTAlgorithm } from "./useSimulation";

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, {
    settings: {
      persistentStorageKey: "min-spanning-tree",
      userAddedEdgeType: "undirected",
      edgeInputToLabel: (input: string) => {
        const parsedInput = Number(input);
        const isNegative = parsedInput < 0;
        const isNotNumber = isNaN(parsedInput);
        if (isNegative || isNotNumber) return;
        return parsedInput.toString();
      },
    },
  });

  const currentAlgorithm = ref<MSTAlgorithm>(MST_ALGORITHMS[0]);

  const simControls = useMSTSimulation(graph, currentAlgorithm);
</script>

<template>
  <div class="w-full h-full relative">
    <Graph
      @graph-ref="(el) => (graphEl = el)"
      :graph="graph"
    />
  </div>

  <div class="absolute top-0 p-3 flex gap-3">
    <div
      v-if="!simControls.isActive.value"
      class="gap-3 flex"
    >
      <Button
        v-for="algorithm in MST_ALGORITHMS"
        @click="currentAlgorithm = algorithm"
        :color="currentAlgorithm === algorithm ? colors.GREEN_600 : undefined"
        :text-color="currentAlgorithm === algorithm ? colors.WHITE : undefined"
        class="capitalize"
      >
        {{ algorithm }}
      </Button>
    </div>
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
      :set-progress="simControls.setStep"
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
