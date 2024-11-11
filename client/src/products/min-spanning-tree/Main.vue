<script setup lang="ts">
import { ref } from "vue";
import { useGraph } from "@graph/useGraph";
import Graph from "@graph/Graph.vue";
import { useSetupGraph, edgeLabelIsPositiveNumber } from "./useSetupGraph";
import Button from "@playground/ui/Button.vue";
import colors from "@utils/colors";
import { useState } from "./useState";
import CollabControls from "@playground/graph/CollabControls.vue";
import Progressbar from "./progressbar/Progressbar.vue";
import {
  mdiPlay,
  mdiPause,
  mdiChevronLeft,
  mdiChevronRight
} from "@mdi/js";

const graphEl = ref<HTMLCanvasElement>();
const graph = useGraph(graphEl, {
  settings: {
    persistentStorageKey: "min-spanning-tree",
    userEditableAddedEdgeType: "undirected",
    edgeInputToLabel: edgeLabelIsPositiveNumber,
  },
});

useSetupGraph(graph);

const {
  colorizeGraph,
  handleStepKeys,
  updateAlgorithm,
  runSimulation,
  setStep,
  stepBackwards,
  stepForwards,
  showSimulation,
  runningSimulation,
  currentAlgorithm,
  computedCanBackwardStep,
  computedCanForwardStep,
  algorithms,
  computedCurrentAlgorithmName,
  computedCurrentStep,
  computedMaxSteps,
} = useState(graph);

graph.subscribe("onStructureChange", colorizeGraph);
graph.subscribe("onEdgeLabelChange", colorizeGraph);
graph.subscribe("onKeydown", handleStepKeys);

const clickRunSimulation = () => {
  setStep(1);
  showSimulation.value = true;
  runSimulation();
  stepBackwards();
};

const btnHeight = 24;
</script>

<template>
  <div class="w-full h-full relative">
    <Button
      v-if="showSimulation"
      @click="(showSimulation = false), (runningSimulation = false)"
      class="absolute m-3 z-50"
    >
      Exit {{ computedCurrentAlgorithmName }} Simulation
    </Button>
    <div v-else class="absolute m-3 flex gap-3 z-50">
      <Button
        v-for="(algorithm, index) in algorithms"
        :key="index"
        @click="updateAlgorithm(algorithm.value)"
        :color="
          currentAlgorithm === algorithm.value ? colors.GREEN_600 : undefined
        "
        :text-color="
          currentAlgorithm === algorithm.value ? colors.WHITE : undefined
        "
      >
        {{ algorithm.label }}
      </Button>
    </div>
    <div
      v-if="currentAlgorithm && showSimulation"
      class="absolute m-3 flex z-50 bottom-2 w-full justify-center items-end"
    >
      <div class="flex flex-col items-center">
        <div class="w-96 mb-5">
          <Progressbar
            :start-progress="0"
            :current-progress="computedCurrentStep"
            :end-progress="computedMaxSteps"
            :theme="{
              progressColor: colors.GRAY_200,
              backgroundColor: colors.SLATE_500,
              borderRadius: 20,
            }"
            class="border-gray-200 border-2"
          />
        </div>
        <div class="flex gap-16 m-6">
          <Button
            @click="stepBackwards(), (runningSimulation = false)"
            style="border-radius: 100px; transform: scale(2)"
          >
            <svg
              :width="btnHeight"
              :height="btnHeight + 8"
              :viewBox="`0 0 ${btnHeight} ${btnHeight}`"
            >
              <path :d="mdiChevronLeft" />
            </svg>
          </Button>
          <Button
            style="border-radius: 100px; transform: scale(2)"
            @click="runSimulation"
          >
            <svg
              :width="btnHeight"
              :height="btnHeight + 8"
              :viewBox="`0 0 ${btnHeight} ${btnHeight}`"
            >
              <path :d="runningSimulation ? mdiPause : mdiPlay" />
            </svg>
          </Button>
          <Button
            style="
              border-radius: 100px;
              transform: scale(2);
              padding-left: 10px;
            "
            @click="stepForwards(), (runningSimulation = false)"
            :color="computedCanForwardStep ? undefined : colors.SLATE_400"
          >
            <svg
              :width="btnHeight - 2"
              :height="btnHeight + 8"
              :viewBox="`0 0 ${btnHeight - 1} ${btnHeight - 1}`"
            >
              <path :d="mdiChevronRight" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
    <div
      v-else-if="currentAlgorithm"
      class="absolute m-3 flex z-50 bottom-16 flex justify-center w-full"
    >
      <Button
        @click="clickRunSimulation"
        class="text-3xl mb-4 shadow-2xl"
        style="padding: 15px 100px 15px 100px; border-radius: 50px"
      >
        Run Simulation
      </Button>
    </div>
    <Graph @graph-ref="(el) => (graphEl = el)" :graph="graph" />

    <div
      v-if="!showSimulation"
      class="absolute right-0 p-3 h-14 flex gap-3 bottom-0"
    >
      <CollabControls :graph="graph" />
    </div>
  </div>
</template>
