<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import { useBasicsTutorial } from "@graph/tutorials/useTutorial";
  import TutorialControls from "@graph/tutorials/TutorialControls.vue";
  import TutorialHint from "@graph/tutorials/TutorialHint.vue";
  import { useGraphBtns } from "@graph/buttons/useGraphBtns";
  import GraphBtns from "@graph/buttons/GraphBtns.vue";
  import Graph from "@graph/Graph.vue";
  import Button from "@playground/shape/Button.vue";
  import colors from "@colors";

  const graphElement = ref<HTMLCanvasElement>();

  const graph = useGraph(graphElement, {
    theme: {}
  });

  const roomId = "graph-playground";

  // const tutorialControls = useBasicsTutorial(graph);

  const { btnArr } = useGraphBtns(graph);
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

    <div class="absolute bottom-0 flex gap-2 m-3 flex flex-wrap w-[85%] h-8">
      <input
        v-model="graph.meAsACollaborator.value.name"
        :disabled="graph.inCollaborativeRoom.value"
        type="text"
        class="p-1 border border-gray-300 rounded-md"
        placeholder="Your Name"
      />

      <input
        v-model="graph.meAsACollaborator.value.color"
        :disabled="graph.inCollaborativeRoom.value"
        :class="`p-1 w-10 h-full rounded-md appearance-none`"
        type="color"
        placeholder="Pick A Color"
      />

      <input
        v-model="roomId"
        :disabled="graph.inCollaborativeRoom.value"
        type="text"
        class="p-1 border border-gray-300 rounded-md"
        placeholder="Collaborative Room ID"
      />

      <Button
        v-if="!graph.inCollaborativeRoom.value"
        @click="graph.joinCollaborativeRoom(roomId)"
        class="bg-blue-500 text-white"
      >
        Join Room
      </Button>

      <Button
        v-else
        @click="graph.leaveCollaborativeRoom()"
        :color="colors.RED_500"
        :textColor="colors.WHITE"
      >
        Leave Room
      </Button>
    </div>

    <!-- <div class="bottom-0 absolute flex gap-2 m-2">
      <TutorialControls :tutorial="tutorialControls" />
    </div>

    <div class="absolute w-full dark:text-white bottom-[10%] grid place-items-center">
      <TutorialHint :tutorial="tutorialControls" />
    </div> -->

  </div>
</template>