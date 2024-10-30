<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import { nodesEdgesToAdjList } from "@graph/converters";
  import type { AdjacencyList } from "@graph/converters";
  import { useBasicsTutorial } from "@graph/tutorials/useTutorial";
  import TutorialControls from "@graph/tutorials/TutorialControls.vue";
  import TutorialHint from "@graph/tutorials/TutorialHint.vue";
  import { useUserPreferredTheme } from "@graph/themes/useUserPreferredTheme";
  import { useGraphBtns } from "@graph/buttons/useGraphBtns";
  import GraphBtns from "@graph/buttons/GraphBtns.vue";
  import { useBFSColorizer } from "@product/search-visualizer/useBFSColorizer";
  import Graph from "@graph/Graph.vue";
  import { getRandomInRange, getSetting } from "@graph/helpers";
  import colors from "@colors";

  const graphElement = ref<HTMLCanvasElement>();

  const emit = defineEmits<{
    (e: "update:modelValue", value: AdjacencyList): void;
  }>();

  const graph = useGraph(graphElement);

  const tutorialControls = useBasicsTutorial(graph);

  const { toggleColorize, isColorized } = useBFSColorizer(graph);
  const colorizeBtn = {
    label: () => (isColorized.value ? "Stop Colorizing" : "Colorize"),
    color: () => (isColorized.value ? "red" : "pink"),
    action: toggleColorize,
    id: "toggle-bfs-colorize" as any,
  };

  graph.subscribe("onStructureChange", (nodes, edges) =>
    emit("update:modelValue", nodesEdgesToAdjList(nodes, edges))
  );

  const {
    reset,
    toggleUserEditable,
    toggleEdgeType,
    changeEdgeWeight,
    clearLocalStorage,
    toggleEdgeLabelDisplay,

    // crazyBtn,
  } = useGraphBtns(graph);

  const btns = [
    reset,
    clearLocalStorage,
    toggleUserEditable,
    toggleEdgeType,
    changeEdgeWeight,
    colorizeBtn,
    toggleEdgeLabelDisplay,

    // crazyBtn,
  ];

  useUserPreferredTheme(graph);

  const log = () => console.log(graph.themeMap.nodeColor)


  const mySetting = getSetting('persistent', graph)
</script>

<template>
  <div class="relative w-full h-full">

    <div class="w-full h-full absolute">
      <Graph
        @graph-ref="(el) => graphElement = el"
        :graph="graph"
      />
    </div>

    <div class="absolute flex gap-2 m-2">
      <GraphBtns :btns="btns" />
    </div>

    <div class="absolute m-2 text-white font-bold text-lg bg-emerald-600 top-0 mt-12 px-4 py-1 rounded-xl">
      <button @click="log">log</button>
    </div>

    <!-- <div class="bottom-0 absolute flex gap-2 m-2">
      <TutorialControls :tutorial="tutorialControls" />
    </div>

    <div class="absolute w-full dark:text-white bottom-[10%] grid place-items-center">
      <TutorialHint :tutorial="tutorialControls" />
    </div> -->

  </div>
</template>
