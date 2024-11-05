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
  import ThemeControls from "./ThemeControls.vue";
  import type { GraphPlaygroundControls as Controls } from "./types";
  import GraphPlaygroundControls from "./GraphPlaygroundControls.vue";
  import { useLocalStorage } from "@vueuse/core";

  const graphElement = ref<HTMLCanvasElement>();

  const graph = useGraph(graphElement);

  const tutorialControls = useBasicsTutorial(graph);

  const { btnArr } = useGraphBtns(graph);

  const controls = useLocalStorage<Controls>("graph-playground-controls", {
    tutorial: true,
    theme: true,
    collab: true,
    settings: true,
  });
</script>

<template>
  <div class="relative w-full h-full">
    <div class="w-full h-full absolute">
      <Graph
        @graph-ref="(el) => (graphElement = el)"
        :graph="graph"
      />
    </div>

    <div
      v-if="controls.settings"
      class="absolute flex gap-2 m-2 flex flex-wrap w-[85%]"
    >
      <GraphBtns :btns="btnArr" />
    </div>

    <div
      v-if="controls.collab"
      class="absolute bottom-0 right-0 flex gap-2 h-8 m-2"
    >
      <CollabControls :graph="graph" />
    </div>

    <div
      v-if="controls.tutorial"
      class="bottom-0 absolute flex gap-2 m-2"
    >
      <TutorialControls :tutorial="tutorialControls" />
    </div>

    <div
      v-if="controls.tutorial"
      class="absolute w-full dark:text-white bottom-[10%] grid place-items-center"
    >
      <TutorialHint :tutorial="tutorialControls" />
    </div>

    <div
      v-if="controls.theme"
      class="absolute h-1/2 w-[325px] top-1/4 right-0 overflow-auto bg-gray-800 bg-opacity-80 rounded-l-xl"
    >
      <ThemeControls :graph="graph" />
    </div>

    <div
      class="absolute w-[150px] top-1/4 overflow-auto bg-gray-800 bg-opacity-80 rounded-r-xl"
    >
      <GraphPlaygroundControls :playgroundControls="controls" />
    </div>
  </div>
</template>
