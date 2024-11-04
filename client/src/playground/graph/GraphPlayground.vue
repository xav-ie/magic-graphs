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

  const graphElement = ref<HTMLCanvasElement>();

  const emit = defineEmits<{
    (e: "update:modelValue", value: AdjacencyList): void;
  }>();

  const graph = useGraph(graphElement, {
    theme: {}
  });

  // const tutorialControls = useBasicsTutorial(graph);

  graph.subscribe("onStructureChange", (nodes, edges) =>
    emit("update:modelValue", nodesEdgesToAdjList(nodes, edges))
  );

  const { btnArr } = useGraphBtns(graph);

  useUserPreferredTheme(graph);

  const log = () => console.log(graph.themeMap.nodeColor)
</script>

<template>
  <div class="relative w-full h-full">

    <div class="w-full h-full absolute">
      <Graph
        @graph-ref="(el) => graphElement = el"
        :graph="graph"
      />
    </div>

    <div class="absolute flex gap-2 m-2 flex flex-wrap w-[85%]">
      <GraphBtns :btns="btnArr" />
    </div>

    <!-- <div class="bottom-0 absolute flex gap-2 m-2">
      <TutorialControls :tutorial="tutorialControls" />
    </div>

    <div class="absolute w-full dark:text-white bottom-[10%] grid place-items-center">
      <TutorialHint :tutorial="tutorialControls" />
    </div> -->

  </div>
</template>
