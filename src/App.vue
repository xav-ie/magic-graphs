<script setup lang="ts">
import { ref } from 'vue';
import Graph from './TestGraph.vue';
import CodeEditor from './products/search-visualizer/CodeEditor.vue';

const weightedGraph = {
  1: [{ node: 2, weight: 4 }, { node: 4, weight: 2 }],
  2: [{ node: 3, weight: 3 }],
  3: [],
  4: [{ node: 5, weight: 3 }, { node: 7, weight: 2 }],
  5: [{ node: 6, weight: 1 }],
  6: [{ node: 4, weight: 1 }],
  7: [{ node: 6, weight: 1 }],
}

const graph = ref<Record<number, number[]>>({ 1: [2], 2: [1], 3: [] })
</script>

<template>
  <div class="bg-[#282c34] w-[100vw] h-[100vh] text-white relative">
    <Graph v-model="graph" />
    <!-- <CodeEditor :graph="graph" /> -->
  </div>
</template>

<style>

/* class for exclusive use by useGraphTutorial, should be move out to css file at some point */
.element-highlight {
  animation: highlight 1s infinite;
}

@keyframes highlight {
  0% {
    background-color: #f6ad55;
  }
  50% {
    background-color: #ed8936;
  }
  100% {
    background-color: #f6ad55;
  }
}
</style>