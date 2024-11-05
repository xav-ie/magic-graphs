<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import { useBasicsTutorial } from "@graph/tutorials/useTutorial";
  import TutorialControls from "@graph/tutorials/TutorialControls.vue";
  import TutorialHint from "@graph/tutorials/TutorialHint.vue";
  import { useGraphBtns } from "@graph/buttons/useGraphBtns";
  import GraphBtns from "@graph/buttons/GraphBtns.vue";
  import Graph from "@graph/Graph.vue";
  import CollabControls from "./CollabControls.vue";

  const graphElement = ref<HTMLCanvasElement>();

  const graph = useGraph(graphElement, {
    theme: {},
  });

  const tutorialControls = useBasicsTutorial(graph);

  const { btnArr } = useGraphBtns(graph);
</script>

<template>
  <div class="relative w-full h-full">
    <div class="w-full h-full absolute">
      <Graph
        @graph-ref="(el) => (graphElement = el)"
        :graph="graph"
      />
    </div>

    <div class="absolute flex gap-2 m-2 flex flex-wrap w-[85%]">
      <GraphBtns :btns="btnArr" />
    </div>

    <div class="absolute bottom-0 right-0 flex gap-2 h-8 m-2">
      <CollabControls :graph="graph" />
    </div>

    <div class="bottom-0 absolute flex gap-2 m-2">
      <TutorialControls :tutorial="tutorialControls" />
    </div>

    <div
      class="absolute w-full dark:text-white bottom-[10%] grid place-items-center"
    >
      <TutorialHint :tutorial="tutorialControls" />
    </div>
  </div>
</template>
