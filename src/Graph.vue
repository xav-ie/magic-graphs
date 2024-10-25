<script setup lang="ts">
  import { computed, ref } from "vue";
  import { useDarkGraph } from "@/useGraph/useGraph";
  import { isObject, useWindowSize } from "@vueuse/core";
  import { bfsNodeColorizer } from "./graphColorizers";
  import {
    nodesEdgesToAdjList,
    adjListToNodesEdges,
    type AdjacencyList,
  } from "./graphConverters";
  import { drawShape } from "./shapes/draw";
  import { hitboxes } from "./shapes/hitboxes";
  import type { PersistentGraphSettings } from "./useGraph/usePersistentGraph";
  import { useGraphBtns } from "./useGraphBtns";
  import { markovSccColorizer } from "./markov-chains/sccColorizer";
  import { useBasicsTutorial } from "./useGraph/tutorial/useTutorial";
import { useUserPreferredTheme } from "./useGraph/themes";
import { useTheme } from "./useGraph/theme/useTheme";

  const canvas = ref<HTMLCanvasElement>();

  const props = defineProps<{
    modelValue: AdjacencyList;
  }>();

  const emit = defineEmits<{
    (e: "update:modelValue", value: AdjacencyList): void;
  }>();

  const { width, height } = useWindowSize();

  const graph = useDarkGraph(canvas, {
    theme: {},
    settings: {},
  });

  // setTimeout(() => {
  //   markovSccColorizer(graph);
  // }, 0)

  const {
    currentStepIndex,
    currentStep,
    sequence,
    skipStep,
    previousStep,
    endTutorial,
    restartTutorial,
  } = useBasicsTutorial(graph);

  graph.subscribe("onStructureChange", (nodes, edges) =>
    emit("update:modelValue", nodesEdgesToAdjList(nodes, edges))
  );

  const {
    reset,
    toggleUserEditable,
    toggleEdgeType,
    changeEdgeWeight,
    clearLocalStorage,
  } = useGraphBtns(graph);

  const btns = [
    reset,
    clearLocalStorage,
    toggleUserEditable,
    toggleEdgeType,
    changeEdgeWeight,
  ];

  const showBtn = (cond: (() => boolean) | undefined) => (cond ? cond() : true);

  useUserPreferredTheme(graph);
</script>

<template>
  <div :class="['relative', `w-[${width}px]`, `h-[${height}px]`]">
    <div class="absolute flex gap-2 m-2">
      <div v-for="btn in btns">
        <button
          v-if="showBtn(btn.cond)"
          @click.stop="btn.action"
          :class="`bg-${btn.color()}-600 text-white px-3 py-1 rounded-lg font-bold`"
          :id="btn.id"
        >
          <span class="select-none">
            {{ btn.label() }}
          </span>
        </button>
      </div>
    </div>

    <div class="bottom-0 absolute flex gap-2 m-2">
      <button
        @click="previousStep"
        :class="`bg-blue-600 text-white px-3 py-1 rounded-lg font-bold`"
      >
        <span class="select-none">Previous Step</span>
      </button>
      <button
        @click="skipStep"
        :class="`bg-blue-600 text-white px-3 py-1 rounded-lg font-bold`"
      >
        <span class="select-none">Skip Step</span>
      </button>
      <button
        @click="endTutorial"
        :class="`bg-blue-600 text-white px-3 py-1 rounded-lg font-bold`"
      >
        <span class="select-none">End Tutorial</span>
      </button>
      <button
        @click="restartTutorial"
        :class="`bg-blue-600 text-white px-3 py-1 rounded-lg font-bold`"
      >
        <span class="select-none">Restart Tutorial</span>
      </button>

      <div class="flex gap-2">
        <span class="select-none">
          {{ currentStepIndex + 1 }} / {{ sequence.length }}
        </span>
      </div>

      <div v-if="currentStep" class="flex gap-2">
        <span class="select-none">
          {{ currentStep.hint }}
        </span>
        </div>
    </div>

    <div>
      <canvas
        :width="width"
        :height="height"
        ref="canvas"
        :class="`w-[${width}px] h-[${height}px]`"
      ></canvas>
    </div>
  </div>
</template>
