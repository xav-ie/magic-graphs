<script setup lang="ts">
  import { ref } from "vue";
  import { useDarkGraph } from "@/useGraph/useGraph";
  import { useWindowSize } from "@vueuse/core";
  import {
    nodesEdgesToAdjList,
    type AdjacencyList,
  } from "./graphConverters";
  import { useBasicsTutorial } from "./useGraph/tutorial/useTutorial";
  import { useUserPreferredTheme } from "./useGraph/themes";
  import { useGraphBtns } from "@/useGraph/button/useGraphBtns";
  import GraphBtns from "@/useGraph/button/GraphBtns.vue";
  import TutorialControls from "@/useGraph/tutorial/TutorialControls.vue";
  import TutorialHint from "./useGraph/tutorial/TutorialHint.vue";

  const canvas = ref<HTMLCanvasElement>();

  const emit = defineEmits<{
    (e: "update:modelValue", value: AdjacencyList): void;
  }>();

  const { width, height } = useWindowSize();

  const graph = useDarkGraph(canvas, {
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

    <div class="absolute bottom-48">
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
