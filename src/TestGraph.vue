<script setup lang="ts">
  import { ref } from "vue";
  import { useWindowSize } from "@vueuse/core";
  import { useGraph } from "@graph/useGraph";
  import { nodesEdgesToAdjList } from "@graph/converters";
  import type { AdjacencyList } from "@graph/converters";
  import { useBasicsTutorial } from "@graph/tutorials/useTutorial";
  import TutorialControls from "@graph/tutorials/TutorialControls.vue";
  import TutorialHint from "@graph/tutorials/TutorialHint.vue";
  import { useUserPreferredTheme } from "@graph/themes/useUserPreferredTheme";
  import { useGraphBtns } from "@graph/buttons/useGraphBtns";
  import GraphBtns from "@graph/buttons/GraphBtns.vue";

  const canvas = ref<HTMLCanvasElement>();

  const emit = defineEmits<{
    (e: "update:modelValue", value: AdjacencyList): void;
  }>();

  const { width, height } = useWindowSize();

  const graph = useGraph(canvas, {
    theme: {},
    settings: {},
  });

  const tutorialControls = useBasicsTutorial(graph);

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

  useUserPreferredTheme(graph);
</script>

<template>
  <div :class="['relative', `w-[${width}px]`, `h-[${height}px]`]">

    <div class="absolute flex gap-2 m-2">
      <GraphBtns :btns="btns" />
    </div>

    <div class="bottom-0 absolute flex gap-2 m-2">
      <TutorialControls :tutorial="tutorialControls" />
    </div>

    <div class="absolute w-full bottom-[10%] grid place-items-center">
      <TutorialHint :tutorial="tutorialControls" />
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
